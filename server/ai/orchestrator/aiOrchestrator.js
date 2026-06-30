import { getGeminiModel } from '../../config/gemini.js';
import plannerAgent from '../agents/plannerAgent.js';
import priorityAgent from '../agents/priorityAgent.js';
import schedulerAgent from '../agents/schedulerAgent.js';
import { getExtensionEmailPrompt } from '../prompts/extension.prompt.js';
import { parseJsonResponse } from '../parser/jsonParser.js';
import toolRegistry from '../tools/toolRegistry.js';
import userRepository from '../../repositories/user.repository.js';
import memoryService from '../../services/memory.service.js';
import { PERSONALITY_PROMPT } from '../prompts/personality.system.js';
import { responseFormatter } from '../parser/responseFormatter.js';
import { intentDetector } from './intentDetector.js';
import { cacheService } from '../../services/cache.service.js';

export const aiOrchestrator = {
  // 1. Coordinates Planner + Priority Agents for a new task
  evaluateNewTask: async (title, description, deadline, estimatedHours, userHabits) => {
    const aiEval = await priorityAgent.calculatePriorityAndRisk(
      title,
      description || '',
      deadline,
      estimatedHours || 1.0,
      userHabits
    );

    const generatedSubtasks = await plannerAgent.generatePlan(
      title,
      description || '',
      estimatedHours || 1.0,
      deadline
    );

    return {
      priority: aiEval.priority,
      deadlineRiskPercent: aiEval.deadlineRiskPercent,
      reason: aiEval.reason,
      subtasks: generatedSubtasks
    };
  },

  // 2. Coordinates Scheduling slots
  scheduleTask: async (title, estimatedHours, deadline, busyEvents, userProfile) => {
    return schedulerAgent.findOptimalSlot(title, estimatedHours, deadline, busyEvents, userProfile);
  },

  // Deprecated/delegated: keeping helper mapping for backward compatibility
  isSimpleQuestion: (message) => {
    return intentDetector.isSimpleQuestion(message);
  },

  detectIntentsHeuristically: (message) => {
    return intentDetector.detectIntentsHeuristically(message);
  },

  // 3. Handles Interactive Natural Language Chat Parsing and execution plan trigger (Agentic Flow)
  parseChatInput: async (userId, message, timezoneOffset = 0) => {
    // 1. Check cache first for repeated requests
    const cacheKey = cacheService.generateKey(userId, message);
    if (cacheKey) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        console.info(`[Cache Hit] Serving cached AI response for: "${message}"`);
        return cached;
      }
    }

    const model = getGeminiModel();
    const clientTime = new Date(new Date().getTime() - timezoneOffset * 60000);
    const clientTimeStr = clientTime.toISOString();
    
    // Classify intents and evaluate simple queries via intentDetector
    const parsedIntents = await intentDetector.detectIntents(message, clientTimeStr);
    const isSimple = intentDetector.isSimpleQuestion(message);

    const contextBlocks = [];
    const actionsExecuted = [];
    let userName = 'Pilot';

    // Fetch user details for profile context
    try {
      const user = await userRepository.findByUid(userId);
      if (user) {
        userName = user.name || userName;
      }
    } catch (e) {}

    // Execute tools and load context safely
    for (const item of parsedIntents) {
      const { intent, args = {} } = item;

      try {
        if (intent === 'view_schedule' || intent === 'calendar_query') {
          const todaySchedule = await toolRegistry.getTodaySchedule(userId);
          const busySlots = await toolRegistry.getBusySlots(userId);
          contextBlocks.push(`
            [Today's Schedule & Busy Slots]
            ${todaySchedule.length === 0 ? 'No events scheduled for today.' : todaySchedule.map(s => `- ${new Date(s.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(s.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}: ${s.title} (${s.type})`).join('\n')}
            Total busy slots found this week: ${busySlots.length}
          `);
        }
        
        if (intent === 'today_tasks' || intent === 'upcoming_deadlines' || intent === 'prioritize_tasks' || intent === 'generate_plan') {
          const tasks = await toolRegistry.getUpcomingTasks(userId);
          contextBlocks.push(`
            [Active Pending Tasks]
            ${tasks.length === 0 ? 'No pending tasks in database.' : tasks.map(t => `- [ID: ${t._id}] "${t.title}" (Due: ${t.deadline.toISOString().split('T')[0]}, Est: ${t.estimatedHours}h, Priority: ${t.priority}, Risk: ${t.deadlineRiskPercent || 0}%)`).join('\n')}
          `);
        }

        if (intent === 'analytics_query') {
          const stats = await toolRegistry.getAnalyticsSummary(userId);
          contextBlocks.push(`
            [Productivity Analytics Summary]
            - Completion Rate: ${stats.completionRate}%
            - Tasks Completed: ${stats.tasksCompleted}
            - Tasks Missed: ${stats.tasksMissed}
            - Focus Duration: ${stats.focusTimeHours} hours
            - Productivity Score: ${stats.productivityScore}
            - Insights: ${stats.insights.join(', ')}
            - Recommendations: ${stats.recommendations.join(', ')}
          `);
        }

        if (intent === 'habit_tracking') {
          const habits = await toolRegistry.getHabitChecklist(userId);
          const profileHabits = await toolRegistry.getUserProfileHabits(userId);
          contextBlocks.push(`
            [Habit Checklist & Streaks]
            ${habits.length === 0 ? 'No habits configured in checklist.' : habits.map(h => `- Habit "${h.title}" (Frequency: ${h.frequency}, Streak: ${h.streak} days)`).join('\n')}
            Profile Habit Settings: Avg Completion Speed ${profileHabits.avgCompletionSpeed}x, Delay Ratio ${profileHabits.delayRatio * 100}%
          `);
        }

        // Handle mutations directly!
        if (intent === 'create_task') {
          try {
            const deadlineDate = args.deadline ? new Date(args.deadline) : new Date(Date.now() + 48 * 3600000);
            const task = await toolRegistry.createTask(userId, {
              title: args.title || 'New Task',
              description: args.description || 'Created via Co-Pilot',
              deadline: isNaN(deadlineDate.getTime()) ? new Date(Date.now() + 48 * 3600000).toISOString() : deadlineDate.toISOString(),
              estimatedHours: parseFloat(args.estimatedHours || 1.0),
              category: args.category || 'General'
            });
            
            actionsExecuted.push({
              type: 'created_task',
              taskId: task._id,
              title: task.title,
              scheduledStart: task.scheduledStart,
              scheduledEnd: task.scheduledEnd
            });
            contextBlocks.push(`[Action Executed] Created new task "${task.title}" with ID ${task._id} and auto-scheduled it.`);
          } catch (e) {
            contextBlocks.push(`[Action Failed] Could not create task: ${e.message}`);
          }
        }

        if (intent === 'update_task' && args.taskId) {
          try {
            const task = await toolRegistry.updateTask(args.taskId, userId, args.updates || {});
            if (task) {
              actionsExecuted.push({
                type: 'updated_task',
                taskId: task._id,
                title: task.title
              });
              contextBlocks.push(`[Action Executed] Updated task "${task.title}" (ID ${task._id}).`);
            }
          } catch (e) {
            contextBlocks.push(`[Action Failed] Could not update task ${args.taskId}: ${e.message}`);
          }
        }

        if (intent === 'delete_task' && args.taskId) {
          try {
            const success = await toolRegistry.deleteTask(args.taskId, userId);
            if (success) {
              actionsExecuted.push({
                type: 'deleted_task',
                taskId: args.taskId
              });
              contextBlocks.push(`[Action Executed] Deleted task ID ${args.taskId}.`);
            }
          } catch (e) {
            contextBlocks.push(`[Action Failed] Could not delete task ${args.taskId}: ${e.message}`);
          }
        }

        if (intent === 'extension_request' && args.taskId) {
          try {
            const task = await toolRegistry.getTaskById(args.taskId, userId);
            if (task) {
              const email = await toolRegistry.generateExtensionEmail(
                task.title,
                task.deadline.toISOString(),
                task.estimatedHours,
                task.deadlineRiskPercent || 15.0,
                args.reason || 'heavy workload',
                userName
              );
              contextBlocks.push(`
                [Generated Extension Request Email Draft]
                Subject: ${email.subject}
                Body: ${email.body}
              `);
            }
          } catch (e) {
            contextBlocks.push(`[Action Failed] Could not generate extension email: ${e.message}`);
          }
        }
      } catch (err) {
        console.error(`Error in tool execution for intent ${intent}:`, err);
        contextBlocks.push(`[Error] Failed executing lookup for ${intent}.`);
      }
    }

    // Bypass Gemini call completely for simple questions
    if (isSimple) {
      const response = responseFormatter.generateLocalFallback(contextBlocks, actionsExecuted, userName, clientTime, parsedIntents);
      if (cacheKey) cacheService.set(cacheKey, response);
      return response;
    }

    if (!model) {
      const response = responseFormatter.generateLocalFallback(contextBlocks, actionsExecuted, userName, clientTime, parsedIntents);
      if (cacheKey) cacheService.set(cacheKey, response);
      return response;
    }

    try {
      const conversationHistory = await memoryService.getRecentConversations(userId, 6);
      const historyStr = conversationHistory.reverse().map(c => `User: ${c.prompt}\nAI: ${c.response}`).join('\n');

      const systemPrompt = `
        ${PERSONALITY_PROMPT}

        Here is the LIVE context fetched from the database for the user:
        - Current Client Time: ${clientTimeStr}
        - User Name: ${userName}
        
        Live DB Context Blocks:
        ${contextBlocks.join('\n')}
        
        Recent Conversation History:
        ${historyStr || 'No recent history.'}
        
        INSTRUCTIONS:
        - Return a strictly structured JSON response representing the AI's reply and any rich cards you want to display to answer the user's question.
        - The JSON response MUST match this schema:
        {
          "type": "schedule | task_list | analytics | calendar | study_plan | brief | reminder | motivation | warning | exam | general",
          "title": "string (Short card title)",
          "summary": "string (Conversational summary or greeting text)",
          "cards": [
            {
              "type": "schedule | tasks | analytics | recommendation | deadline | focus | habit | calendar | studyPlan | morningBrief | warning",
              "data": {}
            }
          ],
          "quickActions": [
             "📅 Show today's schedule",
             "📋 Show pending tasks",
             "📈 Show analytics",
             "🧠 Generate study plan"
          ]
        }

        - In the "cards" array, you can choose to return cards representing the live details:
          - A "schedule" card should contain:
            { "events": [ { "title": "string", "start": "string", "end": "string", "type": "task|meeting", "priority": "Low|Medium|High", "duration": "string", "status": "string" } ] }
          - A "tasks" card should contain:
            { "tasks": [ { "title": "string", "priority": "Low|Medium|High", "deadline": "string", "riskScore": number, "completionPercent": number } ] }
          - A "analytics" card should contain:
            { "focusHours": number, "productivityScore": number, "completedTasks": number, "weeklyTrend": [ { "day": "string", "hours": number } ] }
          - A "recommendation" card should contain:
            { "recommendation": "string", "estimatedImpact": "string", "timeRequired": "string", "actionButtonText": "string", "actionPrompt": "string" }
          - A "deadline" card should contain:
            { "task": "string", "deadline": "string", "urgency": "string", "risk": "string" }
          
        - Choose the correct type, title, and cards to match the user's query intent.
        - Ensure to use emojis and clear phrasing.
      `;

      const chatModel = getGeminiModel('gemini-2.5-flash', systemPrompt);
      if (!chatModel) {
        const response = responseFormatter.generateLocalFallback(contextBlocks, actionsExecuted, userName, clientTime, parsedIntents);
        if (cacheKey) cacheService.set(cacheKey, response);
        return response;
      }

      const result = await chatModel.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `User message: "${message}"` }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const response = responseFormatter.formatResponse(result.response.text().trim(), contextBlocks, actionsExecuted, userName, clientTime, parsedIntents);
      if (cacheKey) cacheService.set(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error compiling final agent response:', error);
      const response = responseFormatter.generateLocalFallback(contextBlocks, actionsExecuted, userName, clientTime, parsedIntents);
      if (cacheKey) cacheService.set(cacheKey, response);
      return response;
    }
  },

  // 4. Coordinates extension request email generation
  generateExtensionEmail: async (taskTitle, deadline, estimatedHours, riskScore, reason, userName) => {
    const model = getGeminiModel();
    if (!model) {
      return {
        subject: `Extension Request: ${taskTitle}`,
        body: `Dear Professor/Manager,\n\nI am writing to request a brief extension for "${taskTitle}" originally due on ${new Date(deadline).toLocaleDateString()}.\n\nBest regards,\n${userName}`
      };
    }

    try {
      const prompt = getExtensionEmailPrompt(taskTitle, deadline, estimatedHours, riskScore, reason, userName);
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonResponse(result.response.text().trim());
      return {
        subject: parsed.subject || `Extension Request: ${taskTitle}`,
        body: parsed.body || ''
      };
    } catch (error) {
      console.error('Error generating extension request email:', error);
      return {
        subject: `Extension Request: ${taskTitle}`,
        body: `Dear Professor/Manager,\n\nI am writing to request an extension for "${taskTitle}".`
      };
    }
  }
};

export default aiOrchestrator;
