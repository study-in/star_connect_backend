// src/app/modules/LiveKit/liveKit.interface.ts
import mongoose, { Document } from 'mongoose';
// Import referenced interfaces if needed, e.g.:
// import { IUser } from '../User/user.interface.js';

export interface ILiveKit extends Document {
  name?: string;

  // Timestamps are added by Mongoose if { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
