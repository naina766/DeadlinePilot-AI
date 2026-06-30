import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, default: 'info' }
}, { 
  timestamps: true 
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
export { Notification };
