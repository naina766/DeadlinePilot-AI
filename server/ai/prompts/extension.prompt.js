export const getExtensionEmailPrompt = (taskTitle, deadline, estimatedHours, riskScore, reason, userName) => `
You are the Extension Request Assistant in DeadlinePilot AI.
Generate a professional, polite, and persuasive email requesting an extension for a task that has a high risk of missing its deadline.
The email should be addressed to a manager, boss, or professor.

Task Details:
- Task Title: "${taskTitle}"
- Original Deadline: "${deadline}"
- Estimated Hours: ${estimatedHours}
- Deadline Risk Percent: ${riskScore}%
- AI Analysis Reason: "${reason}"
- User's Name: "${userName}"

Generate a subject and a body. Output strictly as a JSON object matching this schema:
{
  "subject": "string",
  "body": "string"
}
`;
