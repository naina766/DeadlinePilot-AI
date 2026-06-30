import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  streak: { type: Number, default: 0 },
  completedDates: { type: [Date], default: [] }
}, { 
  timestamps: true 
});

const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
export { Habit };
