import { getGeminiModel } from '../../config/gemini.js';
import { REFLECTION_SYSTEM_PROMPT } from '../prompts/reflection.system.js';
import { getReflectionUserPrompt } from '../prompts/reflection.user.js';
import { REFLECTION_SCHEMA } from '../schema/reflection.schema.js';
import { parseJsonResponse } from '../parser/jsonParser.js';
export const reflectionAgent = {
  generateReflection: async (completedCount, missedCount, focusHours, completedTasksTitles = [], missedTasksTitles = [], userHabits = {}) => {
    const totalTasks = completedCount + missedCount;
    const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 100.0;
    const baseScore = Math.min(100, Math.round((completionRate * 0.7) + (Math.min(focusHours, 8.0) * 3.75)));

    const model = getGeminiModel();
    if (!model) {
      console.warn('No Gemini API connection. Compiling heuristic reflection.');
      return reflectionAgent._getMockReflection(completedCount, missedCount, focusHours, completionRate, baseScore);
    }
    try {
      const delayRatio = userHabits.delayRatio || 0.15;
      const userPrompt = getReflectionUserPrompt(completedCount, missedCount, focusHours, completedTasksTitles, missedTasksTitles, delayRatio);
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: REFLECTION_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: REFLECTION_SCHEMA
        }
      });
      const data = parseJsonResponse(result.response.text().trim());
      return {
        productivityScore: parseInt(data.productivityScore || baseScore, 10),
        insights: data.insights || [],
        recommendations: data.recommendations || [],
        summary: data.summary || ''
      };
    } catch (error) {
      console.error('Error running ReflectionAgent:', error);
      return reflectionAgent._getMockReflection(completedCount, missedCount, focusHours, completionRate, baseScore);
    }
  },
  _getMockReflection: (completed, missed, focus, completionRate, score) => {
    const insights = [
      `You completed ${completed} tasks with a focus duration of ${focus.toFixed(1)} hours.`,
      completionRate > 50 
        ? 'You maintained a high completion efficiency today. Excellent work.' 
        : 'Several deadlines lapsed. Schedule adjustments may be necessary to manage load.'
    ];
    const recommendations = [];
    if (missed > 0) {
      recommendations.push('Deconstruct heavy tasks into smaller blocks to ease execution.');
      recommendations.push('Log your focus blocks using the timer to understand exact task costs.');
    } else {
      recommendations.push('Outstanding progress! Continue placing time buffers on complex tasks.');
      recommendations.push('Plan a short rest period to prevent focus exhaustion.');
    }
    const summary = `**Daily Reflection Summary**: You compiled a task completion rate of **${completionRate.toFixed(0)}%** across ${completed + missed} total tasks. Stay aligned, and keep piloting your deadlines!`;
    return {
      productivityScore: score,
      insights,
      recommendations,
      summary
    };
  }
};
export default reflectionAgent;
