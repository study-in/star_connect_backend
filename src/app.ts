// src/app.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables MUST BE FIRST
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https'; // Import https
import mongoose from 'mongoose'; // <-- ADDED IMPORT
import connectDB from './db'; // Import DB connection function
import logger from './middlewares/logger.middleware'; // Import logger
import globalErrorHandler from './middlewares/error.middleware'; // Import global error handler
import AppError from './utils/AppError'; // Import AppError

// --- Connect to Database ---
connectDB();

const app = express();

// --- View Engine Setup ---
app.set('view engine', 'ejs');
// Use path.resolve to ensure correct path regardless of where script is run
app.set('views', path.resolve(process.cwd(), 'views')); // Points to views folder in project root

// --- Middlewares ---
// Enable CORS - Configure origins properly for production
app.use(cors());
// Or configure specific origins:
// app.use(cors({ origin: process.env.FRONTEND_URL }));

// Body parsers
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies (limit size)
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded bodies

// Request Logger
app.use(logger);

// --- Static Files ---
// Serve static files from 'public' directory
app.use('/static', express.static(path.resolve(process.cwd(), 'public')));

// --- Routes ---
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import livekitRoutes from './routes/livekit.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import expertRoutes from './routes/expert.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
// ... import other routes ...

// Root/Test routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Welcome to Star Connect API!'});
});
app.get('/home', (req: Request, res: Response) => {
  res.render('index'); // Renders views/index.ejs
});

// API Routes Versioning
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/livekit', livekitRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/experts', expertRoutes); // Routes for expert-specific actions/data
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/notifications', notificationRoutes);
// ... use other routes ...

app.use('/api/v1', apiRouter); // Mount all API routes under /api/v1


// --- Handle Undefined Routes ---
// This middleware should be AFTER all your defined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handling Middleware ---
// Must be the LAST middleware defined
app.use(globalErrorHandler);


// --- Server Setup ---
const PORT = process.env.PORT || 3001; // Use 3001 as default if PORT not in .env

let server: http.Server | https.Server;

// Conditional server creation: HTTPS if cert files exist, otherwise HTTP
const certDir = path.resolve(process.cwd(), 'cert');
const certPath = path.join(certDir, 'server.cert');
const keyPath = path.join(certDir, 'server.key');

try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };
        server = https.createServer(httpsOptions, app);
        console.log("Attempting to start HTTPS server...");
    } else {
        console.log("Certificate files ('server.cert', 'server.key') not found in 'cert' directory.");
        console.log("Starting HTTP server...");
        server = http.createServer(app);
    }

    server.listen(PORT, () => {
        console.log(`
Server type: ${server instanceof https.Server ? 'HTTPS' : 'HTTP'}`);
        console.log(`App running on port ${PORT}...`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

} catch (err: any) { // Type err in catch
     console.error("FATAL: Server startup error:", err);
     process.exit(1);
}

// --- Graceful Shutdown Handling ---
const shutdown = (signal: string) => {
    console.log(`
👋 ${signal} RECEIVED. Shutting down gracefully...`);
    server?.close(() => {
        console.log('💥 HTTP server closed.');
        // Now mongoose is defined
        mongoose.connection.close(false).then(() => { // Mongoose >= 6.9 returns promise
             console.log(' Mongoose connection closed.');
             process.exit(0);
        }).catch((err: Error) => { // <-- TYPED err
             console.error('Error closing Mongoose connection:', err);
             process.exit(1);
        });
    });
     // Force close server after a timeout if graceful shutdown fails
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000); // 10 seconds timeout
};

// Handle Unhandled Rejections (e.g., DB connection errors after startup)
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(reason?.name || 'Error', reason?.message || reason);
    // Optionally log the stack: console.error(reason.stack);
    // Graceful shutdown
    shutdown('unhandledRejection');

});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    // Graceful shutdown (optional for uncaught exceptions, as state might be corrupt)
    // Consider just exiting: process.exit(1);
     shutdown('uncaughtException');
});


// Handle SIGTERM (e.g., from Heroku, Docker) and SIGINT (Ctrl+C)
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));


export default app; // Export app for testing or other purposes
