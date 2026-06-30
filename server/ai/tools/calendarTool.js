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
        start: t.scheduledStart.toISOString(),
        end: t.scheduledEnd.toISOString()
      });
    });

    const cal = await CalendarEvent.find({ userId });
    cal.forEach(c => {
      busy.push({
        start: c.startTime.toISOString(),
        end: c.endTime.toISOString()
      });
    });
  } catch (error) {
    console.error('Error fetching busy slots in tool:', error);
  }
  return busy;
};
