import express from 'express';
import mongoose from 'mongoose';
import admin from '../config/firebase.js';
import { cacheService } from '../services/cache.service.js';
const router = express.Router();
const formatUptime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const firebaseStatus = admin && admin.apps && admin.apps.length > 0 ? 'connected' : 'disconnected';
  const geminiStatus = process.env.GEMINI_API_KEY ? 'available' : 'unavailable';
  const cacheStatus = cacheService ? 'ready' : 'not ready';
  res.json({
    status: 'healthy',
    server: 'online',
    database: dbStatus,
    firebase: firebaseStatus,
    gemini: geminiStatus,
    cache: cacheStatus,
    uptime: formatUptime(process.uptime()),
    version: '1.0.0'
  });
});
export default router;
export { router };
