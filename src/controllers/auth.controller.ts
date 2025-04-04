// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import ms from 'ms'; // Import ms

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Add input validation here if needed (e.g., using Joi, express-validator)
    const newUser = await authService.registerUserService(req.body);
    // Exclude sensitive data before sending response if necessary
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        // Avoid sending password back, even if undefined
        // data: { user: newUser }
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUserService(email, password);

    // Set cookie (optional, consider security implications - HttpOnly, Secure, SameSite)
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict' as const, // Or 'lax' - Use 'as const' for literal type
        expires: new Date(Date.now() + ms(process.env.TOKEN_EXPIRATION || '1h')) // Cookie expiry based on token expiry
    };
    res.cookie('jwt', token, cookieOptions);


    res.status(200).json({
        status: 'success',
        token,
        data: { user } // User object (without password) is returned
    });
});

// Placeholder for logout if using cookies/server-side sessions
export const logout = (req: Request, res: Response) => {
   res.cookie('jwt', 'loggedout', {
       expires: new Date(Date.now() + 10 * 1000), // Expire quickly
       httpOnly: true
    });
   res.status(200).json({ status: 'success' });
};
