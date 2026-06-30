import { logger } from '../config/logger.js';

export const notificationQueue = {
  add: async (payload) => {
    logger.info(`Queue: Added notification task for user ${payload.userId} to processing queue.`);
    // Future background processing hook (e.g., BullMQ, Redis)
  }
};

export default notificationQueue;
