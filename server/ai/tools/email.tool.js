import aiOrchestrator from '../orchestrator/aiOrchestrator.js';

export const generateExtensionEmail = async (taskTitle, deadline, estimatedHours, riskScore, reason = '', userName = 'DeadlinePilot User') => {
  try {
    return await aiOrchestrator.generateExtensionEmail(taskTitle, deadline, estimatedHours, riskScore, reason, userName);
  } catch (error) {
    console.error('Error generating email in tool:', error);
    return {
      subject: `Extension Request: ${taskTitle}`,
      body: `Dear Professor/Manager,\n\nI am writing to request a brief extension for "${taskTitle}".`
    };
  }
};
