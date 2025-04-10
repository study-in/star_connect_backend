// src/app/modules/Auth/auth.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAuth } from './auth.interface.js'; // Use .js

const authSchema: Schema<IAuth> = new Schema<IAuth>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Auth = mongoose.model<IAuth, Model<IAuth>>('Auth', authSchema);

export default Auth;
