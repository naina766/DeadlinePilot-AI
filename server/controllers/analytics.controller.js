import Task from '../models/Task.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import reflectionAgent from '../ai/agents/reflectionAgent.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const analyticsController = {

  getAnalytics: async (req, res) => {
    try {
      const userId = req.user.uid;
      const tasks = await Task.find({ userId });

      const completedTasks = [];
      const missedTasks = [];
      const pendingTasks = [];
      let calculatedFocusHours = 0.0;
      tasks.forEach(t => {
        if (t.status === 'Completed') {
          completedTasks.push(t);
          calculatedFocusHours += t.estimatedHours || 1.0;
        } else if (t.status === 'Overdue') {
          missedTasks.push(t);
        } else {
          pendingTasks.push(t);
        }
      });

      const analyticsLogs = await Analytics.find({ userId });
      let loggedFocusHours = 0.0;
      analyticsLogs.forEach(log => {
        loggedFocusHours += log.focusTimeHours || 0.0;
      });
      const totalFocusHours = loggedFocusHours > 0 ? loggedFocusHours : (calculatedFocusHours > 0 ? calculatedFocusHours * 1.2 : 0.0);
      const user = await User.findOne({ firebaseUID: userId });
      const habits = user?.settings?.habits || { avgCompletionSpeed: 1.0, delayRatio: 0.15 };

      const reflection = await reflectionAgent.generateReflection(
        completedTasks.length,
        missedTasks.length,
        totalFocusHours,
        completedTasks.slice(0, 5).map(t => t.title),
        missedTasks.slice(0, 5).map(t => t.title),
        habits
      );
      const total = completedTasks.length + missedTasks.length;
      const completionRate = total > 0 ? parseFloat(((completedTasks.length / total) * 100).toFixed(1)) : 100.0;
      return sendSuccess(res, {
        completionRate,
        tasksCompleted: completedTasks.length,
        tasksMissed: missedTasks.length,
        tasksPending: pendingTasks.length,
        focusTimeHours: parseFloat(totalFocusHours.toFixed(1)),
        productivityScore: reflection.productivityScore || 70,
        insights: reflection.insights || [],
        recommendations: reflection.recommendations || [],
        summary: reflection.summary || '',
        dailyCompletionTrend: [
          { day: 'Mon', completed: Math.max(0, Math.floor(completedTasks.length / 3)) },
          { day: 'Tue', completed: Math.max(0, Math.floor(completedTasks.length / 2)) },
          { day: 'Wed', completed: Math.max(0, Math.floor(completedTasks.length / 2) + 1) },
          { day: 'Thu', completed: Math.max(0, Math.floor(completedTasks.length / 4)) },
          { day: 'Fri', completed: completedTasks.length }
        ]
      });
    } catch (error) {
      console.error('Error compiling analytics:', error);
      return sendError(res, 'Failed to compile analytics summary', 500, error.message);
    }
  },
  // POST /api/analytics/log-focus
  logFocus: async (req, res) => {
    try {
      const userId = req.user.uid;
      const { minutes } = req.body;
      if (!minutes) {
        return sendError(res, 'Minutes parameter is required', 400);
      }
      const hours = minutes / 60.0;
      const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
      // Find and update or create analytics block for today
      let log = await Analytics.findOne({ userId, date: todayStr });

      if (log) {
        log.focusTimeHours = (log.focusTimeHours || 0.0) + hours;
        await log.save();
      } else {
        log = new Analytics({
          userId,
          date: todayStr,
          focusTimeHours: hours,
          tasksCompleted: 0,
          tasksMissed: 0,
          productivityScore: 70
        });
        await log.save();
      }
      return sendSuccess(res, { status: 'success', loggedHours: parseFloat(hours.toFixed(2)) });
    } catch (error) {
      console.error('Error logging focus time:', error);
      return sendError(res, 'Failed to log focus time', 500, error.message);
    }
  }
};
export default analyticsController;
