import CalendarEvent from '../models/CalendarEvent.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import googleCalendarService from '../services/googleCalendar.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { createEventSchema } from '../validators/calendar.validator.js';

export const calendarController = {
  // GET /api/calendar/events
  getEvents: async (req, res) => {
    try {
      const userId = req.user.uid;
      const events = [];

      // 1. Fetch custom events
      const customEvents = await CalendarEvent.find({ userId });
      customEvents.forEach(e => {
        events.push({
          id: e._id,
          userId: e.userId,
          title: e.title,
          description: e.description,
          start: e.startTime.toISOString(),
          end: e.endTime.toISOString(),
          type: e.type,
          sourceTaskId: e.taskId
        });
      });

      // 2. Fetch active tasks scheduled blocks
      const tasks = await Task.find({ 
        userId, 
        scheduledStart: { $ne: null }, 
        scheduledEnd: { $ne: null } 
      });

      tasks.forEach(t => {
        if (t.status !== 'Completed') {
          events.push({
            id: `task-event-${t._id}`,
            userId,
            title: `⏳ Pilot: ${t.title}`,
            description: t.description || '',
            start: t.scheduledStart.toISOString(),
            end: t.scheduledEnd.toISOString(),
            type: 'task',
            sourceTaskId: t._id.toString()
          });
        }
      });

      // 3. Inject sleep blocks and lecture blocks from user profile settings
      const profile = await User.findOne({ firebaseUID: userId });
      if (profile) {
        const sleepStart = profile.settings?.sleepStart || '23:00';
        const sleepEnd = profile.settings?.sleepEnd || '07:00';
        const classes = profile.settings?.classes || [];

        const today = new Date();
        
        // Inject for yesterday, today, and next 3 days
        for (let offset = -1; offset <= 3; offset++) {
          const targetDay = new Date(today);
          targetDay.setDate(today.getDate() + offset);
          
          // Sleep block injection
          try {
            const [sh, sm] = sleepStart.split(':').map(Number);
            const [eh, em] = sleepEnd.split(':').map(Number);
            
            const sleepS = new Date(targetDay);
            sleepS.setHours(sh, sm, 0, 0);
            
            const sleepE = new Date(targetDay);
            if (eh < sh) { // spans midnight
              sleepE.setDate(targetDay.getDate() + 1);
            }
            sleepE.setHours(eh, em, 0, 0);

            events.push({
              id: `sleep-${targetDay.toISOString().split('T')[0]}`,
              userId,
              title: '💤 Sleep Block',
              description: 'Rest and recovery hours',
              start: sleepS.toISOString(),
              end: sleepE.toISOString(),
              type: 'personal'
            });
          } catch (err) {}

          // Classes block injection
          const weekday = targetDay.getDay(); // 0 is Sunday
          classes.forEach(cl => {
            if (cl.days && cl.days.includes(weekday)) {
              try {
                const [csh, csm] = cl.start.split(':').map(Number);
                const [ceh, cem] = cl.end.split(':').map(Number);
                
                const classS = new Date(targetDay);
                classS.setHours(csh, csm, 0, 0);
                
                const classE = new Date(targetDay);
                classE.setHours(ceh, cem, 0, 0);

                events.push({
                  id: `class-${cl.name}-${targetDay.toISOString().split('T')[0]}`,
                  userId,
                  title: `🎓 Class: ${cl.name}`,
                  description: 'Lecture slot block',
                  start: classS.toISOString(),
                  end: classE.toISOString(),
                  type: 'personal'
                });
              } catch (err) {}
            }
          });
        }
      }

      return sendSuccess(res, events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return sendError(res, 'Failed to fetch calendar blocks', 500, error.message);
    }
  },

  // POST /api/calendar/events
  createEvent: async (req, res) => {
    const validation = createEventSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 'Validation error', 400, validation.error.format());
    }

    try {
      const userId = req.user.uid;
      const { title, description, start, end, type } = validation.data;

      const newEvent = await CalendarEvent.create({
        userId,
        title,
        description: description || '',
        startTime: new Date(start),
        endTime: new Date(end),
        type: type || 'meeting'
      });

      return sendSuccess(res, newEvent, 201);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return sendError(res, 'Failed to insert calendar event', 500, error.message);
    }
  },

  // POST /api/calendar/sync
  syncCalendar: async (req, res) => {
    try {
      const userId = req.user.uid;
      const syncResult = await googleCalendarService.syncCalendar(userId);
      return sendSuccess(res, syncResult);
    } catch (error) {
      return sendError(res, 'Calendar sync failure', 500, error.message);
    }
  }
};

export default calendarController;
