import plannerAgent from '../agents/plannerAgent.js';

export const generatePlan = async (title, description = '', estimatedHours = 1.0, deadline = '') => {
  try {
    return await plannerAgent.generatePlan(title, description, estimatedHours, deadline);
  } catch (error) {
    console.error('Error generating plan in planner tool:', error);
    return [];
  }
};
