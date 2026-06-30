export const getReminderUserPrompt = (taskTitle, deadline, nextSubtask, freeHours, riskPercent) => `
Format an action-focused nudge:
- Task: "${taskTitle}"
- Deadline: "${deadline}"
- Next steps/subtask to work on: "${nextSubtask}"
- Free time slot available right now: ${freeHours} hours
- Missed deadline risk probability: ${riskPercent}%
`;
