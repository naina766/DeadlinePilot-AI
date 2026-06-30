import aiService from '../services/ai.service.js';
import aiOrchestrator from '../ai/orchestrator/aiOrchestrator.js';
import taskRepository from '../repositories/task.repository.js';
import userRepository from '../repositories/user.repository.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const aiController = {

  scheduleTask: async (req, res) => {
    try {
      const userId = req.user.uid;
      const taskId = req.params.taskId;
      const result = await aiService.autoScheduleTask(taskId, userId);
      return sendSuccess(res, result);
    } catch (error) {
      console.error('Error scheduling task in controller:', error);
      return sendError(res, 'Failed to schedule task', 500, error.message);
    }
  },

  generateReminder: async (req, res) => {
    try {
      const userId = req.user.uid;
      const taskId = req.params.taskId;
      const reminder = await aiService.getSmartReminder(taskId, userId);
      return sendSuccess(res, reminder);
    } catch (error) {
      console.error('Error generating reminder in controller:', error);
      return sendError(res, 'Failed to create reminder', 500, error.message);
    }
  },

  getBrief: async (req, res) => {
    try {
      const userId = req.user.uid;
      const { type = 'morning' } = req.query;
      const brief = await aiService.getAIBrief(userId, type);
      return sendSuccess(res, { brief });
    } catch (error) {
      console.error('Error generating AI brief in controller:', error);
      return sendSuccess(res, { brief: 'Welcome back! Chart your schedule and pilot your deadlines today.' });
    }
  },

  chat: async (req, res) => {
    try {
      const userId = req.user.uid;
      const { message, timezoneOffset = 0 } = req.body;

      if (!message) {
        return sendError(res, 'Message is required', 400);
      }
      const result = await aiService.processAIChat(userId, message, timezoneOffset);
      return sendSuccess(res, result);
    } catch (error) {
      console.error('Error in AI Chat assistant:', error);
      const fallbackReply = JSON.stringify({
        type: "general",
        title: "📋 Workspace Summary",
        summary: "I'm temporarily unable to generate an AI response, but here's your current workspace summary.",
        cards: [],
        quickActions: [
          "📅 Show today's schedule",
          "📋 Show pending tasks",
          "📈 Show analytics",
          "🧠 Generate study plan"
        ]
      });
      return sendSuccess(res, {
        reply: fallbackReply,
        suggestedActions: []
      });
    }
  },

  naturalAdd: async (req, res) => {
    try {
      const userId = req.user.uid;
      const { text } = req.body;

      if (!text) {
        return sendError(res, 'Text prompt is required', 400);
      }
      const task = await aiService.processNaturalQuickAdd(userId, text);
      return sendSuccess(res, task, 201);
    } catch (error) {
      console.error('Error running NLP Quick Add:', error);
      return sendError(res, 'Failed to process natural language quick-add', 500, error.message);
    }
  },

  generateExtensionRequest: async (req, res) => {
    try {
      const userId = req.user.uid;
      const taskId = req.params.taskId;
      const task = await taskRepository.findById(taskId);
      if (!task) {
        return sendError(res, 'Task not found', 404);
      }
      if (task.userId !== userId) {
        return sendError(res, 'Forbidden', 403);
      }
      const user = await userRepository.findByUid(userId);
      const userName = user ? user.name : 'DeadlinePilot User';
      const emailData = await aiOrchestrator.generateExtensionEmail(
        task.title,
        task.deadline.toISOString(),
        task.estimatedHours,
        task.deadlineRiskPercent,
        task.description,
        userName
      );
      return sendSuccess(res, emailData);
    } catch (error) {
      console.error('Error generating email request extension:', error);
      return sendError(res, 'Failed to generate extension request email', 500, error.message);
    }
  }
};
export default aiController;
