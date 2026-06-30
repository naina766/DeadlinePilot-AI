import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

export const profileController = {
  // GET /api/profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.uid;
      let profile = await User.findOne({ firebaseUID: userId });

      if (!profile) {
        profile = new User({
          firebaseUID: userId,
          email: req.user.email,
          name: req.user.name,
          settings: {
            workStart: '09:00',
            workEnd: '17:00',
            sleepStart: '23:00',
            sleepEnd: '07:00',
            classes: [
              { name: 'DBMS Lecture', days: [1, 3], start: '10:00', end: '11:30' }
            ],
            habits: { avgCompletionSpeed: 1.0, delayRatio: 0.15 }
          }
        });
        await profile.save();
      }

      return sendSuccess(res, profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return sendError(res, 'Failed to fetch user settings profile', 500, error.message);
    }
  },

  // PUT /api/profile
  updateProfile: async (req, res) => {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 'Validation error', 400, validation.error.format());
    }

    try {
      const userId = req.user.uid;
      const { displayName, workStart, workEnd, sleepStart, sleepEnd, classes, habits } = validation.data;
      
      let profile = await User.findOne({ firebaseUID: userId });
      if (!profile) {
        profile = new User({
          firebaseUID: userId,
          email: req.user.email
        });
      }

      if (displayName !== undefined) profile.name = displayName;
      
      // Update settings properties
      profile.settings = profile.settings || {};
      if (workStart !== undefined) profile.settings.workStart = workStart;
      if (workEnd !== undefined) profile.settings.workEnd = workEnd;
      if (sleepStart !== undefined) profile.settings.sleepStart = sleepStart;
      if (sleepEnd !== undefined) profile.settings.sleepEnd = sleepEnd;
      if (classes !== undefined) profile.settings.classes = classes;
      if (habits !== undefined) profile.settings.habits = habits;

      await profile.save();
      return sendSuccess(res, profile);
    } catch (error) {
      console.error('Error updating settings profile:', error);
      return sendError(res, 'Failed to save profile adjustments', 500, error.message);
    }
  }
};

export default profileController;
