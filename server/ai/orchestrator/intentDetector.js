import { getGeminiModel } from '../../config/gemini.js';
import { parseJsonResponse } from '../parser/jsonParser.js';
export const intentDetector = {

  isSimpleQuestion: (message) => {
    if (!message) return false;
    const msg = message.toLowerCase().trim();

    const simplePatterns = [
      /^(show\s+)?(today'?s\s+)?tasks?(\s+for\s+today)?$/i,
      /^(show\s+)?pending\s+tasks?$/i,
      /^(show\s+)?upcoming\s+deadlines?$/i,
      /^(show\s+)?my\s+deadlines?$/i,
      /^(show\s+)?(my\s+)?habits?$/i,
      /^(show\s+)?(my\s+)?focus(\s+sessions)?$/i,
      /^(show\s+)?analytics$/i,
      /^(show\s+)?productivity\s+stats$/i,
      /^(show\s+)?productivity\s+score$/i,
      /^(show\s+)?calendar$/i,
      /^(show\s+)?(my\s+)?schedule$/i,
      /^(show\s+)?workspace\s+summary$/i,
      /^(give\s+me\s+a\s+)?workspace\s+summary$/i,
      /^(give\s+me\s+a\s+)?summary$/i
    ];

    const keywords = [
      "today's tasks", "pending tasks", "upcoming deadlines", "my habits",
      "my focus sessions", "focus sessions", "analytics", "calendar", 
      "workspace summary", "my schedule"
    ];

    if (simplePatterns.some(pat => pat.test(msg))) {
      return true;
    }

    const words = msg.split(/\s+/);
    if (words.length <= 4) {
      if (keywords.some(kw => msg.includes(kw))) {
        return true;
      }
    }

    return false;
  },

  detectIntents: async (message, clientTimeStr) => {
    const model = getGeminiModel();
    let intents = [];

    const heurIntents = intentDetector.detectIntentsHeuristically(message);

    if (intentDetector.isSimpleQuestion(message)) {
      return heurIntents;
    }
    if (!model) {
      return heurIntents;
    }
    try {
      const intentPrompt = `
        You are DeadlinePilot AI. Analyze the user's message and detect which intents/actions they want to trigger.
        User Message: "${message}"
        Current Client Time: "${clientTimeStr}"
        Available Intents:
        1. "view_schedule" - checking schedule, calendar, or free time.
        2. "today_tasks" - checking active tasks, pending tasks, or what to work on.
        3. "upcoming_deadlines" - near-future deadlines.
        4. "create_task" - when user wants to add/create a new task. Extract: "title", "description", "deadline" (ISO string), "estimatedHours" (number), "category".
        5. "update_task" - when user wants to update/modify a task. Extract: "taskId", "updates" (object containing status, priority, estimatedHours, title, category etc.).
        6. "delete_task" - when user wants to delete/remove a task. Extract: "taskId".
        7. "prioritize_tasks" - checking task priorities, ranking tasks, or asking what is most important.
        8. "generate_plan" - breaking a task into subtasks or planning study/work schedule.
        9. "calendar_query" - general calendar queries or schedule events.
        10. "analytics_query" - checking focus hours, productivity score, completion rate, or performance reviews.
        11. "motivation" - asking for time tips, motivational reminders, or coaching.
        12. "habit_tracking" - checking daily habit checklist, completion, or streaks.
        13. "extension_request" - generating a draft email asking for deadline extension. Extract: "taskId", "reason".
        14. "chat" - generic chat or general questions.
        Format return strictly as a JSON object matching this schema:
        {
          "intents": [
            {
              "intent": "string",
              "args": {}
            }
          ]
        }
      `;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: intentPrompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonResponse(result.response.text().trim());
      intents = parsed.intents || [];
      if (intents.length === 0) {
        intents = heurIntents;
      }
    } catch (err) {
      console.error("Error in AI intent detection, falling back to heuristics:", err);
      intents = heurIntents;
    }
    return intents;
  },
  detectIntentsHeuristically: (message) => {
    const msg = message.toLowerCase();
    const intents = [];

    if (msg.includes('schedule') || msg.includes('calendar') || msg.includes('meeting') || msg.includes('appointment')) {
      intents.push({ intent: 'view_schedule' });
    }
    if (msg.includes('task') || msg.includes('todo') || msg.includes('pending') || msg.includes('do today')) {
      intents.push({ intent: 'today_tasks' });
    }
    if (msg.includes('deadline') || msg.includes('due') || msg.includes('limit') || msg.includes('exam')) {
      intents.push({ intent: 'upcoming_deadlines' });
    }
    if (msg.includes('priority') || msg.includes('prioritize') || msg.includes('important')) {
      intents.push({ intent: 'prioritize_tasks' });
    }
    if (msg.includes('plan') || msg.includes('subtask') || msg.includes('breakdown')) {
      intents.push({ intent: 'generate_plan' });
    }
    if (msg.includes('stat') || msg.includes('analytic') || msg.includes('productivity') || msg.includes('score') || msg.includes('focus')) {
      intents.push({ intent: 'analytics_query' });
    }
    if (msg.includes('habit') || msg.includes('streak') || msg.includes('daily check')) {
      intents.push({ intent: 'habit_tracking' });
    }
    if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg.includes('morning') || msg.includes('evening')) {
      intents.push({ intent: 'chat' });
    }
    if (intents.length === 0) {
      intents.push({ intent: 'chat' });
    }
    return intents;
  }
};
export default intentDetector;
