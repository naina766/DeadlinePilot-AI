export const REFLECTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    productivityScore: { 
      type: 'INTEGER', 
      description: 'Productivity score from 0 to 100 based on completion rates and focus hours.' 
    },
    insights: { 
      type: 'ARRAY', 
      items: { type: 'STRING' },
      description: '2 to 3 bullet points analyzing the user\'s performance, bottlenecks, or gains.' 
    },
    recommendations: { 
      type: 'ARRAY', 
      items: { type: 'STRING' },
      description: '2 to 3 actionable steps to optimize scheduling or habits tomorrow.' 
    },
    summary: { 
      type: 'STRING', 
      description: 'Brief, encouraging summary overview of the reflection period (markdown formatted).' 
    }
  },
  required: ['productivityScore', 'insights', 'recommendations', 'summary']
};
