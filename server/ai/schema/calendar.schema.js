export const CALENDAR_SCHEMA = {
  type: "object",
  properties: {
    slots: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          timeRange: { type: "string" },
          description: { type: "string" }
        },
        required: ["title", "timeRange"]
      }
    }
  },
  required: ["slots"]
};

export default CALENDAR_SCHEMA;
