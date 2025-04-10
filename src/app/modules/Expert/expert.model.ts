// src/app/modules/Expert/expert.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IExpert } from './expert.interface.js'; // Use .js

const expertSchema: Schema<IExpert> = new Schema<IExpert>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Expert = mongoose.model<IExpert, Model<IExpert>>('Expert', expertSchema);

export default Expert;
