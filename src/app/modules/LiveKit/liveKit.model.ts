// src/app/modules/LiveKit/liveKit.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILiveKit } from './liveKit.interface.js'; // Use .js

const liveKitSchema: Schema<ILiveKit> = new Schema<ILiveKit>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const LiveKit = mongoose.model<ILiveKit, Model<ILiveKit>>('LiveKit', liveKitSchema);

export default LiveKit;
