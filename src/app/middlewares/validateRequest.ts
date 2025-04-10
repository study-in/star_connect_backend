// src/app/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';
import httpStatus from 'http-status';

/**
 * Middleware factory to validate request data against a Zod schema.
 * Validates req.body, req.query, and req.params.
 * @param schema The Zod schema to validate against.
 * @returns Express middleware function.
 */
const validateRequest = (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies, // Also validate cookies if schema includes them
      });
      next(); // Validation successful
    } catch (error) {
      // Let the global error handler deal with ZodError
      next(error);
    }
  };

export default validateRequest;
