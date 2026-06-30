export const getSchedulerUserPrompt = (taskTitle, estimatedHours, proposedStart, proposedEnd, sleepStart, sleepEnd, workStart, workEnd, deadline) => `
Task details and proposed allocation:
- Title: "${taskTitle}"
- Estimated Hours: ${estimatedHours}
- Proposed Start: "${proposedStart}"
- Proposed End: "${proposedEnd}"
- Deadline: "${deadline}"

User Schedule Context:
- Sleep hours: ${sleepStart} to ${sleepEnd}
- Work/Active hours: ${workStart} to ${workEnd}
`;
