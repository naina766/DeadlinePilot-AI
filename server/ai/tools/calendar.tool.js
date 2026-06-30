import CalendarEvent from '../../models/CalendarEvent.js';
import Task from '../../models/Task.js';

export const getBusySlots = async (userId) => {
  const busy = [];
  try {
    const tasks = await Task.find({ 
      userId, 
      scheduledStart: { $ne: null }, 
      scheduledEnd: { $ne: null } 
    });
    tasks.forEach(t => {
      busy.push({
        id: `task-event-${t._id}`,
        title: `⏳ Pilot: ${t.title}`,
        start: t.scheduledStart.toISOString(),
        end: t.scheduledEnd.toISOString(),
        type: 'task'
      });
    });

    const cal = await CalendarEvent.find({ userId });
    cal.forEach(c => {
      busy.push({
        id: c._id.toString(),
        title: c.title,
        start: c.startTime.toISOString(),
        end: c.endTime.toISOString(),
        type: c.type
      });
    });
  } catch (error) {
    console.error('Error fetching busy slots in calendar tool:', error);
  }
  return busy;
};

export const getTodaySchedule = async (userId) => {
  try {
    const allEvents = await getBusySlots(userId);
    const todayStr = new Date().toDateString();
    
    return allEvents.filter(ev => {
      const evStart = new Date(ev.start);
      return evStart.toDateString() === todayStr;
    });
  } catch (error) {
    console.error('Error fetching today schedule in calendar tool:', error);
    return [];
  }
};

export const createEvent = async (userId, eventData) => {
  try {
    const { title, description, startTime, endTime, type } = eventData;
    return await CalendarEvent.create({
      userId,
      title,
      description: description || '',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      type: type || 'meeting'
    });
  } catch (error) {
    console.error('Error creating event in calendar tool:', error);
    throw error;
  }
};
