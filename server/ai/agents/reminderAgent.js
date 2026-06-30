import { getGeminiModel } from '../../config/gemini.js';
import { REMINDER_SYSTEM_PROMPT } from '../prompts/reminder.system.js';
import { getReminderUserPrompt } from '../prompts/reminder.user.js';
import { REMINDER_SCHEMA } from '../schema/reminder.schema.js';
import { parseJsonResponse } from '../parser/jsonParser.js';

export const reminderAgent = {
  generateReminder: async (taskTitle, deadlineStr, subtasks = [], freeDurationHours = 2.0, riskPercent = 10.0) => {
    const model = getGeminiModel();
    const pendingSubs = subtasks.filter(s => s.status === 'pending').map(s => s.title);
    const nextStep = pendingSubs.length > 0 ? pendingSubs[0] : 'the main task';

    if (!model) {
      console.warn('No Gemini API connection. Generating template reminder.');
      return reminderAgent._getMockReminder(taskTitle, deadlineStr, nextStep, freeDurationHours, riskPercent);
    }

    try {
      const userPrompt = getReminderUserPrompt(taskTitle, deadlineStr, nextStep, freeDurationHours, riskPercent);
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: REMINDER_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: REMINDER_SCHEMA
        }
      });

      const data = parseJsonResponse(result.response.text().trim());
      return {
        message: data.message || `Reminder to work on: ${nextStep}`,
        urgency: data.urgency || 'info'
      };
    } catch (error) {
      console.error('Error running ReminderAgent:', error);
      return reminderAgent._getMockReminder(taskTitle, deadlineStr, nextStep, freeDurationHours, riskPercent);
    }
  },

  _getMockReminder: (taskTitle, deadlineStr, nextStep, freeHours, riskPercent) => {
    let msg = `You have ${freeHours} hours of free space. Let's make progress on "${taskTitle}" by starting: "${nextStep}".`;
    let urgency = 'info';

    if (riskPercent > 70) {
      urgency = 'critical';
      msg = `Critical Alert: The deadline for "${taskTitle}" is highly vulnerable! Protect your record. Dedicate your current ${freeHours} hours to: "${nextStep}".`;
    } else if (riskPercent > 40) {
      urgency = 'warning';
      msg = `Urgent Pilot Nudge: Risk of missing "${taskTitle}" is growing (${riskPercent}%). Work on "${nextStep}" during your open slots today.`;
    }

    return { message: msg, urgency };
  }
};
export default reminderAgent;
