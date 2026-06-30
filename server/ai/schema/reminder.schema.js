export const REMINDER_SCHEMA = {
  type: 'OBJECT',
  properties: {
    message: { type: 'STRING', description: 'Smart motivational reminder nudge.' },
    urgency: { type: 'STRING', enum: ['info', 'warning', 'critical'], description: 'Urgency category.' }
  },
  required: ['message', 'urgency']
};
