import express from 'express';
import aiController from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/schedule-task/:taskId', authMiddleware, aiController.scheduleTask);
router.post('/reminder/:taskId', authMiddleware, aiController.generateReminder);
router.get('/brief', authMiddleware, aiController.getBrief);
router.post('/chat', authMiddleware, aiController.chat);
router.post('/natural-add', authMiddleware, aiController.naturalAdd);
router.post('/extension-email/:taskId', authMiddleware, aiController.generateExtensionRequest);

export default router;
export { router };
