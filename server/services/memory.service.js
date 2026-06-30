import AIConversation from '../models/AIConversation.js';
import Task from '../models/Task.js';
import Analytics from '../models/Analytics.js';

export const memoryService = {
  // Save a conversation turn to MDB
  saveChatTurn: async (userId, prompt, response, agent = 'chat') => {
    try {
      await AIConversation.create({ userId, prompt, response, agent });
    } catch (err) {
      console.error('Error saving conversation memory:', err);
    }
  },

  // Retrieve recent conversations for this user
  getRecentConversations: async (userId, limit = 5) => {
    try {
      return await AIConversation.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    } catch (err) {
      console.error('Error fetching conversation memory:', err);
      return [];
    }
  },

  // Construct a text summary of the user's recent schedule and productivity
  getUserContext: async (userId) => {
    try {
      const recentTasks = await Task.find({ userId }).sort({ deadline: 1 }).limit(10);
      const recentAnalytics = await Analytics.find({ userId }).sort({ date: -1 }).limit(5);

      const tasksSummary = recentTasks.map(t => `- [${t.status}] ${t.title} (due: ${t.deadline.toDateString()}, priority: ${t.priority})`).join('\n');
      const scoreSummary = recentAnalytics.map(a => `- ${a.date}: Score ${a.dailyProductivity}%`).join('\n');

      return `
Task History Context:
${tasksSummary || 'No recent tasks.'}

Recent Productivity Score History:
${scoreSummary || 'No recent productivity scores logged.'}
`;
    } catch (err) {
      console.error('Error preparing user context from memory:', err);
      return '';
    }
  }
};

export default memoryService;
