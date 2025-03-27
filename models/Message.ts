import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
  content: string;
  message_type: string;
  status?: string;
  livekit_flag?: boolean;
  created_at: Date;
  updated_at: Date;
}

const MessageSchema: Schema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  message_type: { type: String, required: true },
  status: { type: String },
  livekit_flag: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
