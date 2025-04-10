// src/app.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables MUST BE FIRST
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import globalErrorHandler from './app/middlewares/globalErrorHandler.js'; // Use .js extension
import apiNotFoundHandler from './app/middlewares/apiNotFoundHandler.js'; // Use .js extension
import config from './config/index.js'; // Use .js extension
import { swaggerSpec } from './utils/swagger.js'; // Use .js extension
import mainApiRouter from './app/routes/index.js'; // Use .js extension
import { logger as requestLogger } from './shared/logger.js'; // Use .js extension for request logging
import serverMonitorPage from './utils/serverMonitor.js'; // Use .js extension

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// --- Security Middleware ---
// Enable CORS
const corsOptions = {
  origin: config.allowed_origins ? config.allowed_origins.split(',') : true, // Allow specified origins or all if not set
  credentials: true, // Allow cookies, authorization headers, etc.
};
app.use(cors(corsOptions));

// Helmet for setting various security headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rate_limit_window_ms, // Use config value
  max: config.rate_limit_max_requests,  // Use config value
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after a while.',
  },
  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers
  legacyHeaders: false, // Disable the \`X-RateLimit-*\` headers
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// --- Standard Middleware ---
// Request logger (Winston based)
if (config.env !== 'test') { // Avoid logging during tests if desired
    app.use((req, res, next) => {
        requestLogger.info(`${req.method} ${req.originalUrl} IP: ${req.ip}`);
        next();
    });
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Response compression
app.use(compression());

// --- View Engine Setup (If using server-side rendering) ---
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views')); // Points to views folder in project root

// --- Static Files ---
// Serve static files from 'public' directory under /static path
app.use('/static', express.static(path.resolve(__dirname, '../public')));
// Serve uploads from /uploadFile path (ensure this dir exists)
// Note: For production, consider using S3/CDN instead of serving uploads directly
app.use('/uploadFile', express.static(path.resolve(__dirname, '../uploadFile')));

// --- API Documentation (Swagger) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  // swaggerOptions: { persistAuthorization: true },
  customSiteTitle: `${config.server_name} API Docs`,
}));
// Optional: Serve the JSON spec
app.get('/api-docs-json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Application Routes ---
// Root route - Server Monitor Page
// Store response times in memory (replace with a more robust solution if needed)
const responseTimes: { route: string; time: number; label: string }[] = [];
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    res.on('finish', () => {
        const duration = performance.now() - start;
        const label = duration >= 1000 ? "High" : duration >= 500 ? "Medium" : "Low";
        // Avoid logging monitor page requests itself
        if (req.path !== '/') {
             responseTimes.push({ route: `${req.method} ${req.originalUrl}`, time: parseFloat(duration.toFixed(2)), label });
             // Optional: Limit the size of the responseTimes array
             if (responseTimes.length > 100) responseTimes.shift();
        }
    });
    next();
});

app.get('/', async (req: Request, res: Response) => {
    res.send(await serverMonitorPage(req, responseTimes));
});
app.get('/home', (req: Request, res: Response) => {
    res.render('index'); // Renders views/index.ejs
});

// Mount Main API Router
app.use('/api/v1', mainApiRouter);

// --- Error Handling ---
// API Not Found Handler (for /api routes)
app.use('/api', apiNotFoundHandler);

// Global Error Handler (Must be the LAST middleware)
app.use(globalErrorHandler);

export default app;
