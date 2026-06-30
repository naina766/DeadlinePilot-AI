import mongoose from 'mongoose';

const SubTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  estimatedMinutes: { type: Number, default: 60 },
  order: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

const SubTask = mongoose.model('SubTask', SubTaskSchema);

export default SubTask;
export { SubTask };
