import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
  reminderTime: { type: Date, required: true, alias: 'scheduledTime' },
  reminderType: { type: String, default: 'email' },
  message: { type: String, required: true },
  delivered: { type: Boolean, default: false, alias: 'sent' },
  urgency: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

const Reminder = mongoose.model('Reminder', ReminderSchema);

export default Reminder;
export { Reminder };
