export const PLANNER_SCHEMA = {
  type: 'ARRAY',
  description: 'List of subtasks to execute the main task.',
  items: {
    type: 'OBJECT',
    properties: {
      title: { type: 'STRING', description: 'Short actionable subtask name.' },
      estimatedHours: { type: 'NUMBER', description: 'Estimated time in decimal hours to complete this subtask.' },
      status: { type: 'STRING', enum: ['pending'], description: 'Always set to "pending".' }
    },
    required: ['title', 'estimatedHours', 'status']
  }
};
