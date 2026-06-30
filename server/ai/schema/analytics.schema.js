export const ANALYTICS_SCHEMA = {
  type: "object",
  properties: {
    focusHours: { type: "number" },
    productivityScore: { type: "number" },
    completedTasks: { type: "number" },
    weeklyTrend: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          hours: { type: "number" }
        },
        required: ["day", "hours"]
      }
    }
  },
  required: ["focusHours", "productivityScore", "completedTasks", "weeklyTrend"]
};

export default ANALYTICS_SCHEMA;
