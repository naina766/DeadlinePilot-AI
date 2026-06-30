import { getGeminiModel } from '../../config/gemini.js';
import { PLANNER_SYSTEM_PROMPT } from '../prompts/planner.system.js';
import { getPlannerUserPrompt } from '../prompts/planner.user.js';
import { PLANNER_SCHEMA } from '../schema/planner.schema.js';
import { parseJsonResponse } from '../parser/jsonParser.js';

export const plannerAgent = {
  generatePlan: async (title, description = '', estimatedHours = 1.0, deadline = '') => {
    const model = getGeminiModel();
    if (!model) {
      console.warn('No Gemini API connection. Generating mock execution plan.');
      return plannerAgent._getMockPlan(title, estimatedHours);
    }

    try {
      const userPrompt = getPlannerUserPrompt(title, description, estimatedHours, deadline);
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: PLANNER_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: PLANNER_SCHEMA
        }
      });

      const responseText = result.response.text().trim();
      const subtasks = parseJsonResponse(responseText);
      
      if (Array.isArray(subtasks)) {
        return subtasks;
      }
      return plannerAgent._getMockPlan(title, estimatedHours);
    } catch (error) {
      console.error('Error running PlannerAgent:', error);
      return plannerAgent._getMockPlan(title, estimatedHours);
    }
  },

  _getMockPlan: (title, estimatedHours) => {
    const steps = ['Research & Context Gathering', 'Development & First Draft', 'Testing & Refinement', 'Final Integration & Submit'];
    const hoursPerStep = Math.max(0.5, parseFloat((estimatedHours / steps.length).toFixed(1)));
    return steps.map(step => ({
      title: `${step} for ${title}`,
      estimatedHours: hoursPerStep,
      status: 'pending'
    }));
  }
};

export default plannerAgent;

