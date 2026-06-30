import Reminder from '../../models/Reminder.js';

export const createReminder = async (userId, taskId, reminderTime, message, urgency = 'info') => {
  try {
    return await Reminder.create({
      userId,
      taskId,
      reminderTime: new Date(reminderTime),
      message,
      urgency
    });
  } catch (error) {
    console.error('Error creating reminder in tool:', error);
    throw error;
  }
};

export const getReminders = async (userId) => {
  try {
    return await Reminder.find({ userId }).sort({ reminderTime: 1 });
  } catch (error) {
    console.error('Error fetching reminders in tool:', error);
    return [];
  }
};
