import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';
import { logger } from './logger.js';
export const connectDB = async () => {
  try {
    logger.info('Connecting to database...');
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);

    if (error.message.includes('querySrv') || error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      logger.warn('DNS resolution failed with default DNS server. Retrying with public DNS (8.8.8.8, 1.1.1.1)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(env.MONGODB_URI);
        logger.info(`MongoDB Connected (via fallback DNS): ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        logger.error(`Fallback DNS Connection Error: ${fallbackError.message}`);
      }
    }

    logger.warn('Continuing application startup. DB operations will fail until MongoDB is active.');
  }
};
