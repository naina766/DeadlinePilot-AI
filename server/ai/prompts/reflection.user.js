export const getReflectionUserPrompt = (completedCount, missedCount, focusHours, completedTasks, missedTasks, delayRatio) => `
Assess the user's daily metrics:
- Tasks Completed: ${completedCount} (${completedTasks.join(', ') || 'None'})
- Tasks Missed/Overdue: ${missedCount} (${missedTasks.join(', ') || 'None'})
- Focus Session Hours: ${focusHours}
- Base Completion Rate: ${completedCount + missedCount > 0 ? (completedCount / (completedCount + missedCount) * 100).toFixed(1) : '100'}%
- User delay ratio habit: ${delayRatio}
`;
