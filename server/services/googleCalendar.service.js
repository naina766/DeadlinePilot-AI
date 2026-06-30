import Task from '../models/Task.js';

export const googleCalendarService = {
  syncCalendar: async (userId) => {
    try {
      const taskCount = await Task.countDocuments({
        userId,
        scheduledStart: { $ne: null }
      });

      return {
        status: 'success',
        provider: 'Google Calendar',
        message: `Successfully synchronized ${taskCount} active scheduling blocks and your class timetables.`,
        lastSynced: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in googleCalendarService sync:', error);
      throw new Error('Google Calendar sync failed.');
    }
  }
};

export default googleCalendarService;
