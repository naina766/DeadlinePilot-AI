import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, analyticsController.getAnalytics);
router.post('/log-focus', authMiddleware, analyticsController.logFocus);

export default router;
export { router };
