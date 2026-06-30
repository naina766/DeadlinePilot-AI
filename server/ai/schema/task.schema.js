export const TASK_SCHEMA = {
  type: "object",
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          priority: { type: "string" }, // Low, Medium, High
          deadline: { type: "string" },
          riskScore: { type: "number" },
          completionPercent: { type: "number" }
        },
        required: ["title", "priority", "deadline", "riskScore", "completionPercent"]
      }
    }
  },
  required: ["tasks"]
};

export default TASK_SCHEMA;
