import * as calendarTool from './calendar.tool.js';
import * as taskTool from './task.tool.js';
import * as analyticsTool from './analytics.tool.js';
import * as notificationTool from './notification.tool.js';
import * as habitTool from './habit.tool.js';
import * as plannerTool from './planner.tool.js';
import * as emailTool from './email.tool.js';
export const toolRegistry = {

  getBusySlots: calendarTool.getBusySlots,
  getTodaySchedule: calendarTool.getTodaySchedule,
  createEvent: calendarTool.createEvent,

  getTasksByUser: taskTool.getTasksByUser,
  getUpcomingTasks: taskTool.getUpcomingTasks,
  getTaskById: taskTool.getTaskById,
  createTask: taskTool.createTask,
  updateTask: taskTool.updateTask,
  deleteTask: taskTool.deleteTask,

  getAnalyticsSummary: analyticsTool.getAnalyticsSummary,
  logFocusTime: analyticsTool.logFocusTime,

  createReminder: notificationTool.createReminder,
  getReminders: notificationTool.getReminders,

  getHabitChecklist: habitTool.getHabitChecklist,
  getUserProfileHabits: habitTool.getUserProfileHabits,
  createHabit: habitTool.createHabit,
  completeHabit: habitTool.completeHabit,

  generatePlan: plannerTool.generatePlan,

  generateExtensionEmail: emailTool.generateExtensionEmail
};
export default toolRegistry;
