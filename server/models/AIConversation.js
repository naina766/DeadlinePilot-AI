import mongoose from 'mongoose';

const AIConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  agent: { type: String, default: 'chat' }
}, { 
  timestamps: true 
});

const AIConversation = mongoose.model('AIConversation', AIConversationSchema);

export default AIConversation;
export { AIConversation };
