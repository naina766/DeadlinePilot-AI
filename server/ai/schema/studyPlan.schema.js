export const STUDY_PLAN_SCHEMA = {
  type: "object",
  properties: {
    planTitle: { type: "string" },
    topics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          duration: { type: "string" },
          difficulty: { type: "string" }, // e.g. Easy, Medium, Hard
          steps: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["name", "duration", "steps"]
      }
    }
  },
  required: ["planTitle", "topics"]
};

export default STUDY_PLAN_SCHEMA;
