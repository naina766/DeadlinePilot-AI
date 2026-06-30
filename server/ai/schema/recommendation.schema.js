export const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    recommendation: { type: "string" },
    estimatedImpact: { type: "string" }, 
    timeRequired: { type: "string" },
    actionButtonText: { type: "string" },
    actionPrompt: { type: "string" }
  },
  required: ["recommendation", "estimatedImpact", "timeRequired"]
};
export default RECOMMENDATION_SCHEMA;
