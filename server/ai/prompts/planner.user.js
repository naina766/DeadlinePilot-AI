export const getPlannerUserPrompt = (title, description, estimatedHours, deadline) => `
Please break down the following task:
- Task Title: "${title}"
- Description: "${description || 'None'}"
- Estimated Total Hours: ${estimatedHours}
- Deadline: "${deadline}"
`;
