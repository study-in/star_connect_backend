import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  expert_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const ReviewSchema: Schema = new Schema({
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
