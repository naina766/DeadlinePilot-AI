import Task from '../../models/Task.js';
import User from '../../models/User.js';
import Analytics from '../../models/Analytics.js';
import reflectionAgent from '../agents/reflectionAgent.js';
export const getAnalyticsSummary = async (userId) => {
  try {
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
    return {
      completionRate,
      tasksCompleted: completedTasks.length,
      tasksMissed: missedTasks.length,
      tasksPending: pendingTasks.length,
      focusTimeHours: parseFloat(totalFocusHours.toFixed(1)),
      productivityScore: reflection.productivityScore || 70,
      insights: reflection.insights || [],
      recommendations: reflection.recommendations || [],
      summary: reflection.summary || ''
    };
  } catch (error) {
    console.error('Error fetching analytics summary in tool:', error);
    return {
      completionRate: 100,
      tasksCompleted: 0,
      tasksMissed: 0,
      tasksPending: 0,
      focusTimeHours: 0,
      productivityScore: 70,
      insights: [],
      recommendations: [],
      summary: 'Data unavailable.'
    };
  }
};
export const logFocusTime = async (userId, minutes) => {
  try {
    const hours = minutes / 60.0;
    const todayStr = new Date().toISOString().split('T')[0];
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
    return log;
  } catch (error) {
    console.error('Error logging focus time in tool:', error);
    throw error;
  }
};
