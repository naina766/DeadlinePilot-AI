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
import { env } from './config/env.js';
const app = express();
app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  message: { error: 'Too many requests. Please try again later.' }
});
app.use(limiter);
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
];
if (env.CLIENT_URL) {
  const urls = env.CLIENT_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
const morganStream = {
  write: (message) => logger.info(message.trim())
};
app.use(morgan('short', { stream: morganStream }));
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/health', healthRouter);
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'DeadlinePilot AI Backend API',
    firebaseAdminActive: !!(admin && admin.apps.length > 0),
    timestamp: new Date().toISOString()
  });
});
app.use(errorHandler);
export default app;
export { app };
