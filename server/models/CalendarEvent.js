import mongoose from 'mongoose';
const CalendarEventSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', alias: 'sourceTaskId', index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  googleEventId: { type: String, default: '' },
  startTime: { type: Date, required: true, alias: 'start' },
  endTime: { type: Date, required: true, alias: 'end' },
  location: { type: String, default: '' },
  synced: { type: Boolean, default: false },
  type: { type: String, enum: ['task', 'meeting', 'personal'], default: 'task' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});
const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema, 'calendars');
export default CalendarEvent;
export { CalendarEvent };
export const Calendar = CalendarEvent; 
