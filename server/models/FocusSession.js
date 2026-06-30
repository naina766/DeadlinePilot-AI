import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

const FocusSession = mongoose.model('FocusSession', FocusSessionSchema);

export default FocusSession;
export { FocusSession };
