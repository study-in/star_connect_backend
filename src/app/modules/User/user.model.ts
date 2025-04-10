// src/app/modules/User/user.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user.interface.js'; // Use .js

const userSchema: Schema<IUser> = new Schema<IUser>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model<IUser, Model<IUser>>('User', userSchema);

export default User;
