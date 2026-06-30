import taskRepository from '../repositories/task.repository.js';
import userRepository from '../repositories/user.repository.js';
import calendarRepository from '../repositories/calendar.repository.js';
import aiOrchestrator from '../ai/orchestrator/aiOrchestrator.js';
import reminderAgent from '../ai/agents/reminderAgent.js';
import memoryService from './memory.service.js';
import taskService from './task.service.js';
import { getGeminiModel } from '../config/gemini.js';
import { getMorningBriefPrompt } from '../ai/prompts/morningBrief.prompt.js';
import { parseJsonResponse } from '../ai/parser/jsonParser.js';

export const aiService = {
  // 1. Auto-schedule a task in a free slot
  autoScheduleTask: async (taskId, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Forbidden');

    // Gather busy times (tasks + manual events)
    const busy = [];
    const scheduledTasks = await taskRepository.findScheduled(userId);
    scheduledTasks.forEach(t => {
      if (t._id.toString() !== taskId) {
        busy.push({ start: t.scheduledStart.toISOString(), end: t.scheduledEnd.toISOString() });
      }
    });

    const manualEvents = await calendarRepository.findByUserId(userId);
    manualEvents.forEach(e => {
      busy.push({ start: e.startTime.toISOString(), end: e.endTime.toISOString() });
    });

    // Fetch user profile settings
    let profile = await userRepository.findByUid(userId);
    if (!profile) {
      profile = await userRepository.create({
        firebaseUID: userId,
        email: 'pilot@deadline.ai',
        name: 'Vibe Pilot'
      });
    }

    const result = await aiOrchestrator.scheduleTask(
      task.title,
      task.estimatedHours || 1.0,
      task.deadline.toISOString(),
      busy,
      profile
    );

    task.scheduledStart = new Date(result.start);
    task.scheduledEnd = new Date(result.end);
    await task.save();

    return {
      taskId: task._id,
      scheduledStart: result.start,
      scheduledEnd: result.end,
      explanation: result.explanation
    };
  },

  // 2. Generate custom motivational reminders
  getSmartReminder: async (taskId, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Forbidden');

    return reminderAgent.generateReminder(
      task.title,
      task.deadline.toISOString(),
      task.subtasks,
      2.0, // Mock free space
      task.deadlineRiskPercent || 15.0
    );
  },

  // 3. Generate morning/evening productivity briefs
  getAIBrief: async (userId, type = 'morning') => {
    const tasks = await taskRepository.findByUserId(userId);
    const user = await userRepository.findByUid(userId);
    const userName = user ? user.name : 'Pilot';

    const todayStr = new Date().toDateString();
    const todayTasks = [];
    const riskyTasks = [];
    let completedTodayCount = 0;

    tasks.forEach(t => {
      if (t.deadline.toDateString() === todayStr) {
        todayTasks.push(t);
      }
      if (t.status !== 'Completed') {
        if (t.deadlineRiskPercent > 40) {
          riskyTasks.push(t);
        }
      } else {
        const completedDate = new Date(t.updatedAt).toDateString();
        if (completedDate === todayStr) {
          completedTodayCount += 1;
        }
      }
    });

    const model = getGeminiModel();
    if (!model) {
      return type === 'morning'
        ? `Hello Pilot. Today, you have ${todayTasks.length} deadlines. ${riskyTasks.length} pending items carry risk. Plan carefully!`
        : `Evening review complete. You finished ${completedTodayCount} tasks. Reflect on gaps, rest well!`;
    }

    const prompt = getMorningBriefPrompt(
      userName,
      type,
      todayTasks.map(t => t.title),
      riskyTasks.map(t => t.title),
      completedTodayCount
    );

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  },

  processAIChat: async (userId, message, timezoneOffset = 0) => {
    try {
      const parsed = await aiOrchestrator.parseChatInput(userId, message, timezoneOffset);
      const replyString = JSON.stringify(parsed);
      
      // Save turn response in memory
      await memoryService.saveChatTurn(userId, message, replyString);

      return {
        reply: replyString,
        suggestedActions: parsed.actions || []
      };
    } catch (error) {
      console.error('Error in AI Chat assistant:', error);
      throw error;
    }
  },

  // 5. NLP Natural Add (Voice triggers)
  processNaturalQuickAdd: async (userId, text) => {
    const model = getGeminiModel();
    if (!model) {
      const deadline = new Date(Date.now() + 24 * 3600 * 1000);
      return taskService.createTask(userId, {
        title: text,
        description: 'Created via NLP quick add',
        deadline: deadline.toISOString(),
        estimatedHours: 1.0,
        category: 'Quick-Add'
      });
    }

    const prompt = `
      You are DeadlinePilot AI. Parse the user's natural language command and extract task details:
      Input: "${text}"
      Current Time: "${new Date().toISOString()}"
      
      Extract:
      1. "title": The core task (e.g. "finish DBMS project")
      2. "description": Any additional details
      3. "deadline": Exact target ISO timestamp (e.g. "before Friday evening" -> Friday at 18:00)
      4. "estimatedHours": A float representing estimated execution time
      5. "category": Standard category (e.g. "Work", "Study", "Personal")
      
      Format return strictly as a JSON object matching this schema:
      {
        "title": "string",
        "description": "string",
        "deadline": "string (ISO)",
        "estimatedHours": 1.0,
        "category": "string"
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonResponse(result.response.text().trim());
      const title = parsed.title || text;
      const description = parsed.description || 'Created via voice command.';
      const deadline = parsed.deadline || new Date(Date.now() + 24 * 3600000).toISOString();
      const estimatedHours = parseFloat(parsed.estimatedHours || 1.0);
      const category = parsed.category || 'General';

      const task = await taskService.createTask(userId, {
        title,
        description,
        deadline,
        estimatedHours,
        category
      });

      // Schedule it
      await aiService.autoScheduleTask(task._id, userId);
      return task;
    } catch (error) {
      console.error('Error parsing NLP Quick Add:', error);
      const deadline = new Date(Date.now() + 24 * 3600000);
      return taskService.createTask(userId, {
        title: text,
        description: 'Quick add task',
        deadline: deadline.toISOString(),
        estimatedHours: 1.0,
        category: 'General'
      });
    }
  }
};

export default aiService;
