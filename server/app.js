import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import tasksRouter from './routes/tasks.js';
import aiRouter from './routes/ai.js';
import calendarRouter from './routes/calendar.js';
import analyticsRouter from './routes/analytics.js';
import profileRouter from './routes/profile.js';
import healthRouter from './routes/health.js';
import errorHandler from './middleware/errorHandler.js';
import { logger } from './config/logger.js';
import admin from './config/firebase.js';

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  message: { error: 'Too many requests. Please try again later.' }
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: '*', // For production, restrict this to specific domain URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging via Morgan + Winston stream
const morganStream = {
  write: (message) => logger.info(message.trim())
};
app.use(morgan('short', { stream: morganStream }));

// Legacy/Core Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/health', healthRouter);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'DeadlinePilot AI Backend API',
    firebaseAdminActive: !!(admin && admin.apps.length > 0),
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
export { app };
