// src/controllers/payment.controller.ts
// Placeholder for Payment controller logic
import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model';

interface AuthRequest extends Request { user?: IUser; }

// Example: Initiate Payment
export const initiatePayment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { amount, currency = 'BDT', bookingId, starWishId } = req.body;
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!amount || amount <= 0) return next(new AppError('Valid amount is required', 400));
    if (!bookingId && !starWishId) return next(new AppError('Either bookingId or starWishId is required', 400));

    // TODO: Verify amount matches the booking/starWish price

    const result = await paymentService.initiateSslCommerzPaymentService(req.user.id, amount, currency, bookingId, starWishId);
    res.status(200).json({ status: 'success', data: result });
});

// Example IPN Handler Route (POST) - No Auth needed
export const handleSslCommerzNotify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // IMPORTANT: Add validation logic here to verify the IPN source if possible
    console.log("SSLCommerz IPN Received:", req.body);
    await paymentService.handleSslCommerzIpnService(req.body);
    // Send a 200 OK response to SSLCommerz to acknowledge receipt
    res.status(200).send('IPN Received and processing initiated.');
});

// Example Success/Fail/Cancel Handlers (GET) - User redirected here
export const handlePaymentSuccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.transactionId;
    // Optional: Verify payment status again based on transactionId if needed
    // Redirect user to a success page on the frontend
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?transaction=${transactionId}`); // Add FRONTEND_URL to .env
});

export const handlePaymentFail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.transactionId;
    // Optional: Log failure, notify user
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail?transaction=${transactionId}`);
});

export const handlePaymentCancel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.transactionId;
     // Optional: Log cancellation
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?transaction=${transactionId}`);
});
