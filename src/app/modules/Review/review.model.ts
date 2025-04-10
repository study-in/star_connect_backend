// src/app/modules/Review/review.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReview } from './review.interface.js'; // Use .js

const reviewSchema: Schema<IReview> = new Schema<IReview>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Review = mongoose.model<IReview, Model<IReview>>('Review', reviewSchema);

export default Review;
