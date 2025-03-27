import mongoose, { Schema, Document } from 'mongoose';

export interface IStarWishOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id: mongoose.Types.ObjectId;
  recipient_name: string;
  recipient_email: string;
  video_type: string;
  instructions?: string;
  tone?: string;
  video_length?: number;
  privacy?: string;
  delivery_time?: string;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

const StarWishOrderSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient_name: { type: String, required: true },
  recipient_email: { type: String, required: true },
  video_type: { type: String, required: true },
  instructions: { type: String },
  tone: { type: String },
  video_length: { type: Number },
  privacy: { type: String },
  delivery_time: { type: String },
  status: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IStarWishOrder>('StarWishOrder', StarWishOrderSchema);
