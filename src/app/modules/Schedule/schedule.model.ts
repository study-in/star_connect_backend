// src/app/modules/Schedule/schedule.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISchedule } from './schedule.interface.js'; // Use .js

const scheduleSchema: Schema<ISchedule> = new Schema<ISchedule>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Schedule = mongoose.model<ISchedule, Model<ISchedule>>('Schedule', scheduleSchema);

export default Schedule;
