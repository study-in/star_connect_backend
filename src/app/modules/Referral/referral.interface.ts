// src/app/modules/Referral/referral.interface.ts
import mongoose, { Document } from 'mongoose';
// Import referenced interfaces if needed, e.g.:
// import { IUser } from '../User/user.interface.js';

export interface IReferral extends Document {
  name?: string;

  // Timestamps are added by Mongoose if { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
