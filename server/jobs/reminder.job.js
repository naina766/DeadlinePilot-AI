import { logger } from '../config/logger.js';
export const runReminderCheck = async () => {
  logger.info('Scheduled Job: Running cron reminder scanner...');

};
export default runReminderCheck;
