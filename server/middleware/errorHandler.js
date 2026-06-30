import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message} \nStack: ${err.stack || 'No Stack'}`);

  const statusCode = err.status || err.statusCode || 500;
  return sendError(
    res, 
    err.message || 'Internal Server Error', 
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

export default errorHandler;
