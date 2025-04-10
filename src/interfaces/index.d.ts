// src/interfaces/index.d.ts
// Global type augmentation for Express Request

// Import IUser definition path based on your structure
import { IUser } from '../app/modules/User/User.interface.js'; // Use .js

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property, populated by auth middleware
    }
  }
}

// This ensures the file is treated as a module.
export {};
