// src/app/middlewares/apiNotFoundHandler.ts
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const apiNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: `API endpoint '${req.method} ${req.originalUrl}' not found on this server`,
      },
    ],
  });
};

export default apiNotFoundHandler;
