import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  mediaUrl: { type: String },
  type: { type: String, enum: ['text', 'audio', 'video'], default: 'text' },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
