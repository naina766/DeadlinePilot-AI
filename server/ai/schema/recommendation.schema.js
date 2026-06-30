export const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    recommendation: { type: "string" },
    estimatedImpact: { type: "string" }, // e.g. High, Medium, Low
    timeRequired: { type: "string" },
    actionButtonText: { type: "string" },
    actionPrompt: { type: "string" }
  },
  required: ["recommendation", "estimatedImpact", "timeRequired"]
};

export default RECOMMENDATION_SCHEMA;
