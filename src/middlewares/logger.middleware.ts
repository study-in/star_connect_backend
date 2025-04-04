// src/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} IP: ${req.ip}`); // Added IP
  next();
};

export default logger;
