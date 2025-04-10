// src/app/modules/Booking/booking.validation.ts
import { z } from 'zod';

// Example: Basic validation for creation
const createBookingValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Booking name is required' }).min(1),
    // Add other fields based on your model
    // Example: email: z.string().email(),
    // Example: price: z.number().positive(),
  }),
  // Example: query validation
  // query: z.object({ ... }),
  // Example: params validation
  // params: z.object({ id: z.string() }) // if expecting an ID in the route path
});

// Example: Basic validation for update (makes all fields optional)
const updateBookingValidationSchema = createBookingValidationSchema.deepPartial();
// You might need more specific update schemas depending on which fields are allowed

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
