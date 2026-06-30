import express from 'express';
import profileController from '../controllers/profile.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);

export default router;
export { router };
