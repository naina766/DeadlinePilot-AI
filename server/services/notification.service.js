import Notification from '../models/Notification.js';

export const notificationService = {
  createNotification: async (userId, title, message, type = 'info') => {
    try {
      return await Notification.create({ userId, title, message, type });
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  },

  getUserNotifications: async (userId) => {
    try {
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }
};

export default notificationService;
