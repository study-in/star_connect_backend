// src/services/payment.service.ts
// Placeholder for Payment related logic (initiate payment, handle IPN, record transaction, etc.)
import Payment from '../models/Payment.model';
import Booking from '../models/Booking.model'; // To update booking status
import StarWishRequest from '../models/StarWishRequest.model'; // To update star wish status
import AppError from '../utils/AppError';

// Example: Initiate SSLCommerz Payment (simplified)
export const initiateSslCommerzPaymentService = async (userId: string, amount: number, currency: string, relatedBookingId?: string, relatedStarWishId?: string) => {
    // 1. Create a 'pending' payment record in your DB
    const transactionId = `TXN_${Date.now()}${Math.random().toString(36).substring(2, 8)}`.toUpperCase(); // Generate unique ID
    const payment = await Payment.create({
        user: userId,
        amount: amount,
        currency: currency,
        status: 'pending',
        paymentGateway: 'SSLCommerz',
        transactionId: transactionId,
        relatedBooking: relatedBookingId,
        relatedStarWish: relatedStarWishId
    });

    // 2. Prepare data for SSLCommerz API call
    const paymentData = {
        store_id: process.env.SSLCOMMERZ_STORE_ID, // Add to .env
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD, // Add to .env
        total_amount: amount,
        currency: currency,
        tran_id: transactionId, // Your unique transaction ID
        success_url: `${process.env.BACKEND_URL}/api/v1/payments/success/${transactionId}`, // Your success callback URL
        fail_url: `${process.env.BACKEND_URL}/api/v1/payments/fail/${transactionId}`,
        cancel_url: `${process.env.BACKEND_URL}/api/v1/payments/cancel/${transactionId}`,
        ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/notify/sslcommerz`, // Your IPN listener URL
        // Customer info
        cus_name: 'Customer Name', // Get from user profile
        cus_email: 'customer@example.com',
        cus_add1: 'Address',
        cus_city: 'City',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01xxxxxxxxx',
        // Product info
        product_name: relatedBookingId ? 'Booking Payment' : 'StarWish Payment',
        product_category: 'Service',
        product_profile: 'general',
        // Optional fields
        // value_a, value_b, value_c, value_d for passing custom data
    };

    // 3. Make POST request to SSLCommerz API endpoint (use axios or fetch)
    // const sslcz = new SSLCommerz(process.env.SSLCOMMERZ_STORE_ID, process.env.SSLCOMMERZ_STORE_PASSWORD, is_live) // Or use their SDK/direct API call
    // const apiResponse = await sslcz.init(paymentData);
    // Example using fetch:
    /*
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.SSLCOMMERZ_API_URL_LIVE : process.env.SSLCOMMERZ_API_URL_SANDBOX;
    if (!apiUrl) throw new AppError('SSLCommerz API URL not configured', 500);
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(paymentData).toString()
    });
    const apiResponse = await response.json();
    if (apiResponse.status === 'SUCCESS') {
        return { gatewayUrl: apiResponse.GatewayPageURL, paymentId: payment._id };
    } else {
        // Update payment status to failed
        payment.status = 'failed';
        payment.gatewayResponse = apiResponse;
        await payment.save();
        throw new AppError(`SSLCommerz initiation failed: ${apiResponse.failedreason || 'Unknown reason'}`, 500);
    }
    */
    console.warn("SSLCommerz API call simulation. Implement actual API call.");
    // Simulate success for scaffolding
    return { gatewayUrl: `https://sandbox.sslcommerz.com/gwprocess/v4/dummy?tran_id=${transactionId}`, paymentId: payment._id };

};

// Example: Handle SSLCommerz IPN
export const handleSslCommerzIpnService = async (ipnData: any): Promise<void> => {
    console.log('Received IPN:', ipnData);
    // TODO: 1. Validate the IPN data (using SSLCommerz validation endpoint is crucial!)
    // const isValid = await validateIpn(ipnData); // Implement validation
    // if (!isValid) { console.error("Invalid IPN received."); return; }

    // 2. Find the corresponding payment record using transactionId (tran_id)
    const payment = await Payment.findOne({ transactionId: ipnData.tran_id });
    if (!payment) {
        console.error(`Payment not found for transaction ID: ${ipnData.tran_id}`);
        return; // Important to avoid processing unknown transactions
    }
    // 3. Check if payment status is already 'succeeded' to prevent reprocessing
    if (payment.status === 'succeeded') {
        console.log(`Payment ${payment._id} already marked as succeeded.`);
        return;
    }
    // 4. Update payment status based on ipnData.status ('VALID', 'FAILED', etc.)
    const oldStatus = payment.status;
    if (ipnData.status === 'VALID') {
        payment.status = 'succeeded';
        payment.validationId = ipnData.val_id; // Store validation ID
    } else if (['FAILED', 'CANCELLED', 'UNAUTHENTICATED'].includes(ipnData.status)) {
        payment.status = 'failed';
    } else {
        // Keep pending or handle other statuses if necessary
        console.log(`IPN received with status: ${ipnData.status}. Payment status remains ${payment.status}.`);
    }
    payment.gatewayResponse = ipnData; // Store latest IPN response
    await payment.save();
    console.log(`Payment ${payment._id} status updated from ${oldStatus} to ${payment.status}`);

    // 5. If payment succeeded, update related Booking/StarWish status
    if (payment.status === 'succeeded') {
        if (payment.relatedBooking) {
            await Booking.findByIdAndUpdate(payment.relatedBooking, { status: 'pending_confirmation' }); // Or 'confirmed'
            console.log(`Updated booking ${payment.relatedBooking} status.`);
        }
        if (payment.relatedStarWish) {
            await StarWishRequest.findByIdAndUpdate(payment.relatedStarWish, { status: 'pending_acceptance' });
            console.log(`Updated StarWish ${payment.relatedStarWish} status.`);
        }
        // TODO: Send success notification to user
    } else {
        // TODO: Send failure notification to user
    }
};
