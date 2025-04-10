// src/app/routes/index.ts
import { Router } from 'express';

// Import module routers (use .js extension)
import authRoutes from '../modules/Auth/auth.route.js';
import userRoutes from '../modules/User/user.route.js';
import expertRoutes from '../modules/Expert/expert.route.js';
import livekitRoutes from '../modules/LiveKit/livekit.route.js';
import bookingRoutes from '../modules/Booking/booking.route.js';
import paymentRoutes from '../modules/Payment/payment.route.js';
import reviewRoutes from '../modules/Review/review.route.js';
import notificationRoutes from '../modules/Notification/notification.route.js';
import serviceRoutes from '../modules/Service/service.route.js'; // Assuming Service module exists
import scheduleRoutes from '../modules/Schedule/schedule.route.js'; // Assuming Schedule module exists
import promoCodeRoutes from '../modules/PromoCode/promocode.route.js'; // Assuming PromoCode module exists
import referralRoutes from '../modules/Referral/referral.route.js'; // Assuming Referral module exists
import starWishRequestRoutes from '../modules/StarWishRequest/starwishrequest.route.js'; // Assuming StarWishRequest module exists
import logsRoutes from '../modules/Logs/logs.route.js'; // For viewing logs

const mainRouter = Router();

interface IModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoute[] = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/experts', route: expertRoutes },
  { path: '/livekit', route: livekitRoutes },
  { path: '/bookings', route: bookingRoutes },
  { path: '/payments', route: paymentRoutes },
  { path: '/reviews', route: reviewRoutes },
  { path: '/notifications', route: notificationRoutes },
  { path: '/services', route: serviceRoutes },
  { path: '/schedules', route: scheduleRoutes },
  { path: '/promocodes', route: promoCodeRoutes },
  { path: '/referrals', route: referralRoutes },
  { path: '/starwishes', route: starWishRequestRoutes },
  // Logs route should be mounted separately in app.ts if not part of API v1
  // { path: '/logs', route: logsRoutes },
];

moduleRoutes.forEach((route) => mainRouter.use(route.path, route.route));

export default mainRouter;
