export const SCHEDULE_SCHEMA = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          type: { type: "string" }, // e.g. task, meeting, personal
          priority: { type: "string" }, // Low, Medium, High
          duration: { type: "string" },
          status: { type: "string" }
        },
        required: ["title", "start", "end", "type", "priority", "status"]
      }
    }
  },
  required: ["events"]
};

export default SCHEDULE_SCHEMA;
