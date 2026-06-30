import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  dailyProductivity: { type: Number, default: 70, alias: 'productivityScore' },
  weeklyProductivity: { type: Number, default: 70 },
  completedTasks: { type: Number, default: 0, alias: 'tasksCompleted' },
  missedDeadlines: { type: Number, default: 0, alias: 'tasksMissed' },
  focusTime: { type: Number, default: 0.0, alias: 'focusTimeHours' },
  generatedAt: { type: Date, default: Date.now },
  insights: { type: [String], default: [] },
  recommendations: { type: [String], default: [] },
  summary: { type: String, default: '' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

AnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model('Analytics', AnalyticsSchema, 'analytics');

export default Analytics;
export { Analytics };
