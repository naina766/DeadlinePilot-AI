export const getPriorityUserPrompt = (title, description, deadline, estimatedHours, currentTime, avgSpeed, delayRatio) => `
Analyze task priority and risk:
- Title: "${title}"
- Description: "${description || 'None'}"
- Estimated Hours: ${estimatedHours}
- Deadline: "${deadline}"
- Current System Time: "${currentTime}"

User Habits & Past Performance:
- Average completion speed factor (1.0 is normal, >1.0 is slower, <1.0 is faster): ${avgSpeed}
- Historical delay ratio (0.0 to 1.0): ${delayRatio}
`;
