import mongoose from 'mongoose';

const EmbeddedSubTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  estimatedHours: { type: Number, default: 1.0 }
});

const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  deadline: { type: Date, required: true },
  estimatedHours: { type: Number, default: 1.0 },
  actualHours: { type: Number, default: 0.0 },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Critical', 'High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  category: { type: String, default: 'General' },
  tags: { type: [String], default: [] },
  attachments: { type: [String], default: [] },
  aiRiskScore: { type: Number, default: 0.0, alias: 'deadlineRiskPercent' },
  completionPercentage: { type: Number, default: 0 },
  calendarEventId: { type: String, default: '' },
  scheduledStart: { type: Date },
  scheduledEnd: { type: Date },
  subtasks: { type: [EmbeddedSubTaskSchema], default: [] }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
export { Task };
