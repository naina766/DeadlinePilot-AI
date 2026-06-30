import { getGeminiModel } from '../../config/gemini.js';
import { PRIORITY_SYSTEM_PROMPT } from '../prompts/priority.system.js';
import { getPriorityUserPrompt } from '../prompts/priority.user.js';
import { PRIORITY_SCHEMA } from '../schema/priority.schema.js';
import { parseJsonResponse } from '../parser/jsonParser.js';
export const priorityAgent = {
  calculatePriorityAndRisk: async (title, description = '', deadline, estimatedHours, userHabits = {}) => {
    const model = getGeminiModel();
    if (!model) {
      console.warn('No Gemini API connection. Calculating heuristic priority.');
      return priorityAgent._getHeuristicPriority(deadline, estimatedHours, userHabits);
    }
    try {
      const currentTime = new Date().toISOString();
      const avgSpeed = userHabits.avgCompletionSpeed || 1.0;
      const delayRatio = userHabits.delayRatio || 0.15;
      const userPrompt = getPriorityUserPrompt(title, description, deadline, estimatedHours, currentTime, avgSpeed, delayRatio);

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: PRIORITY_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: PRIORITY_SCHEMA
        }
      });
      const data = parseJsonResponse(result.response.text().trim());
      return {
        priority: data.priority || 'Medium',
        deadlineRiskPercent: Math.min(100, Math.max(0, parseInt(data.deadlineRiskPercent || 0, 10))),
        reason: data.reason || 'Priority evaluated via Gemini cognitive assistant.'
      };
    } catch (error) {
      console.error('Error running PriorityAgent:', error);
      return priorityAgent._getHeuristicPriority(deadline, estimatedHours, userHabits);
    }
  },
  _getHeuristicPriority: (deadlineStr, estimatedHours, userHabits) => {
    let hoursLeft = 48.0;
    try {
      const deadline = new Date(deadlineStr);
      const now = new Date();
      hoursLeft = (deadline - now) / (1000 * 60 * 60);
    } catch (e) {
      // Ignore
    }
    const avgSpeed = userHabits.avgCompletionSpeed || 1.0;
    const delayRatio = userHabits.delayRatio || 0.15;
    const effectiveHours = estimatedHours * avgSpeed;
    let priority = 'Medium';
    let risk = 20;
    if (hoursLeft <= 0) {
      priority = 'Critical';
      risk = 100;
    } else if (hoursLeft < effectiveHours) {
      priority = 'Critical';
      risk = Math.min(100, Math.round(90 + delayRatio * 10));
    } else {
      const buffer = effectiveHours / hoursLeft;
      risk = Math.min(99, Math.round(buffer * 50 * (1.0 + delayRatio)));
      if (buffer > 0.8) {
        priority = 'High';
      } else if (buffer > 0.4) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }
    }
    return {
      priority,
      deadlineRiskPercent: risk,
      reason: `Heuristic calculation. ${hoursLeft.toFixed(1)}h remaining. Buffer ratio: ${(effectiveHours / Math.max(0.1, hoursLeft)).toFixed(2)}x.`
    };
  }
};
export default priorityAgent;
