// src/routes/payment.routes.ts
import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
const router = Router();

// Initiate payment - requires auth
router.post('/initiate', authMiddleware.protect, paymentController.initiatePayment);

// SSLCommerz callbacks - NO auth middleware, handled by SSLCommerz
router.post('/notify/sslcommerz', paymentController.handleSslCommerzNotify); // IPN Listener
// Use POST for redirect URLs as recommended by SSLCommerz
router.post('/success/:transactionId', paymentController.handlePaymentSuccess); // Success Redirect
router.post('/fail/:transactionId', paymentController.handlePaymentFail);       // Fail Redirect
router.post('/cancel/:transactionId', paymentController.handlePaymentCancel);   // Cancel Redirect

// Optional: Route to check payment status by transaction ID (requires auth)
// router.get('/status/:transactionId', authMiddleware.protect, paymentController.getPaymentStatus);

export default router;
