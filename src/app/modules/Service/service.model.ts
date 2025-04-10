// src/app/modules/Service/service.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IService } from './service.interface.js'; // Use .js

const serviceSchema: Schema<IService> = new Schema<IService>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Service = mongoose.model<IService, Model<IService>>('Service', serviceSchema);

export default Service;
