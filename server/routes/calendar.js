import express from 'express';
import calendarController from '../controllers/calendar.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/events', authMiddleware, calendarController.getEvents);
router.post('/events', authMiddleware, calendarController.createEvent);
router.post('/sync', authMiddleware, calendarController.syncCalendar);

export default router;
export { router };
