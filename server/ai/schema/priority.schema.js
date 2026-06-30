export const PRIORITY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    priority: { 
      type: 'STRING', 
      enum: ['Critical', 'High', 'Medium', 'Low'], 
      description: 'Priority level calculated based on user habits and urgency.' 
    },
    deadlineRiskPercent: { 
      type: 'INTEGER', 
      description: 'Probability of missing the deadline as a percentage from 0 to 100.' 
    },
    reason: { 
      type: 'STRING', 
      description: 'Detailed analysis explaining the risk rating and priority choice.' 
    }
  },
  required: ['priority', 'deadlineRiskPercent', 'reason']
};
