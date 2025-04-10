// src/app/modules/PromoCode/promoCode.interface.ts
import mongoose, { Document } from 'mongoose';
// Import referenced interfaces if needed, e.g.:
// import { IUser } from '../User/user.interface.js';

export interface IPromoCode extends Document {
  name?: string;

  // Timestamps are added by Mongoose if { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
