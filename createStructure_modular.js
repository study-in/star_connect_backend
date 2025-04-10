// createStructure_modular.js
// Import necessary Node.js modules
const fs = require('fs'); // Using synchronous fs for simplicity
const path = require('path');

// --- Configuration ---
const projectRootDir = process.cwd();
const projectName = path.basename(projectRootDir); // Get project name from current dir

console.log(`Setting up project: ${projectName} in ${projectRootDir}`);

// Helper function to capitalize
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
// Helper function to lowercase first letter
const lowerCaseFirst = (str) => str ? str.charAt(0).toLowerCase() + str.slice(1) : '';

// Define Module Names (based on your models)
// You can adjust these or add more as needed
const modules = [
    'Auth', // For login/register
    'User', // For user profile, expert application status
    'Expert', // For expert-specific actions (managing services, schedule)
    'Service', // Managing offered services
    'Schedule', // Managing expert availability
    'Booking', // Handling user bookings
    'LiveKit', // LiveKit token generation
    'Payment', // Payment processing (SSLCommerz)
    'Review', // User reviews for experts
    'Notification', // In-app notifications
    'PromoCode', // Discount codes
    'Referral', // User referrals
    // Add other distinct feature areas as modules if necessary
    'Logs' // For log viewing endpoint
];

// Define directories to create (Modular Structure)
const baseDirectories = [
    'src',
    'src/app',
    'src/app/middlewares',
    'src/app/modules',
    'src/app/routes', // Main router aggregator
    'src/config',
    'src/errors',
    'src/helpers',
    'src/html', // For email templates etc.
    'src/interfaces', // Common interfaces (can also be in modules)
    'src/shared', // Reusable utilities (catchAsync, sendResponse, logger, pick)
    'src/utils', // Other utilities (AppError, serverMonitor, swagger)
    path.join('public', 'images'),
    path.join('public', 'javascripts'),
    path.join('public', 'stylesheets'),
    'views', // For EJS templates
    'cert', // For SSL certificates
    'logs', // For Winston logs
    'logs/winston',
    'logs/winston/successes',
    'logs/winston/errors',
    '.github', // For CI/CD
    '.github/workflows'
];

// Add module-specific directories
const moduleDirectories = modules.flatMap(moduleName => [
    `src/app/modules/${moduleName}`
    // Sub-folders within modules are handled when creating files
]);

const allDirectories = [...baseDirectories, ...moduleDirectories];

// --- Create Directories ---
console.log('\nCreating directories...');
allDirectories.forEach((dir) => {
    const fullPath = path.join(projectRootDir, dir);
    try {
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`  Created directory: ${fullPath}`);
        } else {
            // console.log(`  Directory already exists: ${fullPath}`);
        }
    } catch (err) {
        console.error(`  Error creating directory ${fullPath}:`, err);
    }
});
console.log('Directories creation complete.\n');

// --- Define Sample Files ---
// Array to hold all file objects
const sampleFiles = [];

// Function to add file object to the array
const addFile = (filePath, content) => {
    sampleFiles.push({ filePath, content: content.trim() + '\n' }); // Ensure newline at end
};

// Helper function to generate module file path
const modulePath = (moduleName, fileName) => path.join('src', 'app', 'modules', moduleName, fileName);

// =============================================
// PART 1: CONFIGURATION & CORE SETUP FILES
// =============================================
console.log('Defining configuration and core files...');

// --- Config Files ---
addFile('.env', `
# General Server Config
NODE_ENV=development
PORT=3000
SERVER_NAME=${projectName || 'star-connect-backend-ts'}
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000 # Add your frontend URL(s), comma-separated
BACKEND_URL=http://localhost:3000 # Your backend base URL for callbacks etc.
FRONTEND_URL=http://localhost:3001 # Your frontend base URL for redirects

# Database
MONGODB_URI=mongodb://localhost:27017/${projectName || 'starconnect'} # Replace with your MongoDB connection string
# TEST_DATABASE_URL=mongodb://localhost:27017/${projectName}-test

# Security & JWT
JWT_SECRET=replace_this_with_a_very_strong_random_secret_key_at_least_32_chars
JWT_EXPIRES_IN=1h # Example: 1h, 1d, 30m
JWT_REFRESH_SECRET=replace_this_with_another_strong_random_secret_key
JWT_REFRESH_EXPIRES_IN=7d # Example: 7d, 30d

# LiveKit
LIVEKIT_API_KEY= # Your LiveKit API Key (e.g., API...)
LIVEKIT_API_SECRET= # Your LiveKit API Secret
# LIVEKIT_URL= # Optional: Your LiveKit server URL (ws:// or wss://) if using RoomServiceClient

# Payment Gateway (SSLCommerz Example)
SSLCOMMERZ_STORE_ID= # Your SSLCommerz Store ID
SSLCOMMERZ_STORE_PASSWORD= # Your SSLCommerz Store Password
SSLCOMMERZ_API_URL_SANDBOX=https://sandbox.sslcommerz.com # Sandbox BASE URL (check specific endpoints in SDK/docs)
SSLCOMMERZ_API_URL_LIVE=https://securepay.sslcommerz.com # Live BASE URL
SSLCOMMERZ_IS_LIVE=false # Set to true for production

# Email (Example using Mailtrap for dev, configure for SendGrid/AWS SES etc. for prod)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER= # Your Mailtrap username
SMTP_PASS= # Your Mailtrap password
EMAIL_FROM="Star Connect <no-reply@starconnect.example.com>"

# Rate Limiting (Example: 300 requests per 5 minutes per IP)
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX_REQUESTS=300

# HTTPS (Set true if using HTTPS, requires cert files)
HTTPS=false

# Optional: S3 for File Uploads
# S3_ACCESS_KEY_ID=
# S3_SECRET_ACCESS_KEY=
# S3_BUCKET=
# S3_REGION=
`);

addFile('tsconfig.json', `{
  "compilerOptions": {
    /* Base Options */
    "esModuleInterop": true, // Enables compatibility with CommonJS modules
    "skipLibCheck": true, // Skip type checking of declaration files
    "target": "ES2020", // Target modern ECMAScript version
    "allowJs": true, // Allow JavaScript files to be compiled
    "resolveJsonModule": true, // Allow importing JSON modules
    "moduleDetection": "force", // Treat files lacking imports/exports as modules
    "isolatedModules": true, // Ensure files can be safely transpiled without relying on other imports
    "verbatimModuleSyntax": false, // Use default module syntax transformation

    /* Strictness */
    "strict": true, // Enable all strict type-checking options
    "noUncheckedIndexedAccess": true, // Add 'undefined' to types accessed via index signature
    "noImplicitOverride": true, // Ensure overriding members are marked with 'override'

    /* Bundled Libraries */
    // "lib": ["ESNext"], // Specify library files (ESNext usually includes latest features)

    /* Modules */
    "module": "NodeNext", // Use Node.js native ECMAScript modules
    "moduleResolution": "NodeNext", // Use Node.js module resolution strategy
    // "baseUrl": "./", // Base directory for non-relative module names
    // "paths": {}, // Path mapping if needed
    // "rootDirs": ["./src"], // Treat 'src' as root

    /* Emit */
    "outDir": "./dist", // Output directory for compiled files
    "sourceMap": true, // Generate source maps for debugging
    // "declaration": true, // Generate corresponding '.d.ts' files
    // "declarationMap": true, // Generate source maps for '.d.ts' files

    /* Type Checking */
    "forceConsistentCasingInFileNames": true, // Disallow inconsistently-cased references

    /* Completeness */
    // "skipDefaultLibCheck": true, // Skip type checking default library declaration files
  },
  "include": ["src/**/*.ts", "src/interfaces/**/*.d.ts"], // Include all TS files in src and global type definitions
  "exclude": ["node_modules", "dist"] // Exclude node_modules and dist folders
}
`);

addFile('package.json', `{
  "name": "${projectName || 'star-connect-backend-ts'}",
  "version": "1.0.0",
  "description": "A Node.js backend for Star Connect (TypeScript, Modular)",
  "main": "dist/server.js", // Entry point should be server.ts
  "type": "module", // Important for NodeNext module system
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only --exit-child --watch src src/server.ts", // Use server.ts as entry
    "lint": "eslint . --ext .ts --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext .ts --fix",
    "prettier": "prettier --check ./src",
    "prettier:fix": "prettier --write ./src",
    "test": "echo \\"Error: no test specified\\" && exit 1"
    // Add production start script e.g., using pm2
    // "start:prod": "pm2 start dist/server.js -i max --name ${projectName || 'star-connect'}"
  },
  "keywords": ["nodejs", "typescript", "express", "mongodb", "livekit", "sslcommerz", "jwt"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "colors": "^1.4.0", // For colored console logs (used in server.ts example)
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5", // Updated version
    "ejs": "^3.1.9",
    "express": "^4.18.2", // Stable version
    "express-rate-limit": "^7.2.0", // Updated version
    "helmet": "^7.1.0", // Updated version
    "http-status": "^1.7.3", // Updated version
    "jsonwebtoken": "^9.0.2", // Updated version
    "livekit-server-sdk": "^1.2.7", // Keep existing
    "mongoose": "^8.1.1", // Updated version
    "ms": "^2.1.3", // Keep existing
    "nodemailer": "^6.9.9", // For sending emails
    "os-utils": "^0.0.14", // For server monitor
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0", // Updated version
    "winston": "^3.11.0", // Updated version
    "winston-daily-rotate-file": "^4.7.1", // Keep existing
    "zod": "^3.22.4" // For validation
    // Add other specific dependencies like axios or node-fetch if needed for SSLCommerz
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6", // Updated version
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.6", // Updated version
    "@types/cors": "^2.8.17", // Updated version
    "@types/ejs": "^3.1.5",
    "@types/express": "^4.17.21",
    "@types/http-status": "^1.5.0",
    "@types/jsonwebtoken": "^9.0.5", // Updated version
    "@types/ms": "^0.7.34", // Updated version
    "@types/node": "^20.11.16", // Use specific LTS version
    "@types/nodemailer": "^6.4.14", // Updated version
    "@types/os-utils": "^0.0.4",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "@typescript-eslint/eslint-plugin": "^6.21.0", // Updated version
    "@typescript-eslint/parser": "^6.21.0", // Updated version
    "eslint": "^8.56.0", // Updated version
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "nodemon": "^3.1.7", // Added for potential alternative dev script
    "prettier": "^3.2.4", // Updated version
    "ts-node": "^10.9.2", // Updated version
    "ts-node-dev": "^2.0.0", // Keep existing
    "typescript": "^5.3.3" // Updated version
  },
   "engines": {
     "node": ">=18.0.0" // Specify minimum Node.js version
   }
}
`);

addFile('.gitignore', `
# Dependencies
node_modules/
dist/

# Environment variables
.env
.env*.local

# Logs
logs/*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log.*

# Build artifacts
*.tsbuildinfo

# OS generated files
.DS_Store
Thumbs.db

# IDE specific
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Certificates (if self-signed and not meant to be committed)
cert/server.key
# cert/server.cert # Keep if CA signed or intentionally shared

# Misc
coverage/
`);

addFile('.eslintrc.js', `
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Integrates Prettier rules into ESLint
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Link to your tsconfig for type-aware linting
  },
  plugins: [
    '@typescript-eslint',
    'prettier', // Add prettier plugin
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // Enforce Prettier rules, auto handles line endings
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Warn about console.log in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Warn about unused vars, ignore if prefixed with _
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about using 'any' type
    // Add other specific rules as needed
    'indent': 'off', // Handled by Prettier
    '@typescript-eslint/indent': 'off', // Handled by Prettier
    'linebreak-style': 'off', // Handled by Prettier/Git
    'quotes': 'off', // Handled by Prettier
    'semi': 'off', // Handled by Prettier
  },
  ignorePatterns: ['node_modules/', 'dist/', '*.js', '*.d.ts'], // Ignore JS files in root, dist, etc.
};
`);

addFile('.prettierrc', `{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "auto"
}
`);

addFile('.eslintignore', `
node_modules
dist
coverage
logs
cert
*.md
*.yaml
*.yml
*.json
*.js
`);

// --- Core App Files ---
addFile('src/app.ts', `
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
  standardHeaders: true, // Return rate limit info in the \\\`RateLimit-*\\\` headers
  legacyHeaders: false, // Disable the \\\`X-RateLimit-*\\\` headers
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// --- Standard Middleware ---
// Request logger (Winston based)
if (config.env !== 'test') { // Avoid logging during tests if desired
    app.use((req, res, next) => {
        requestLogger.info(\`\${req.method} \${req.originalUrl} IP: \${req.ip}\`);
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
  customSiteTitle: \`\${config.server_name} API Docs\`,
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
             responseTimes.push({ route: \`\${req.method} \${req.originalUrl}\`, time: parseFloat(duration.toFixed(2)), label });
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
`);

addFile('src/server.ts', `
// src/server.ts
import mongoose from 'mongoose';
import http from 'http';
import https from 'https'; // Import https
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules
import 'colors'; // For colored console output

import app from './app.js'; // Use .js extension
import config from './config/index.js'; // Use .js extension
import { errorLogger, logger } from './shared/logger.js'; // Use .js extension
import { createUploadDirectories } from './utils/fileUtils.js'; // Use .js extension
import { updateServerTime } from './utils/serverMonitor.js'; // Use .js extension

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle Uncaught Exceptions (Must be at the top)
process.on('uncaughtException', (error: Error) => {
  const message = \`\🚨 Uncaught Exception! Shutting down...\n\${error.name}: \${error.message}\`;
  if (config.env === 'production') {
    errorLogger.error(message, error); // Log full error in prod logs
  } else {
    console.error(message.red.bold);
    console.error(error.stack);
  }
  process.exit(1); // Exit immediately - state might be corrupt
});

let server: http.Server | https.Server;

// --- Database Connection ---
async function connectDatabase() {
  try {
    await mongoose.connect(config.database_url, {
      dbName: \`\${config.server_name}-db\`,
      // Add other mongoose options if needed
      // useNewUrlParser: true, // No longer needed
      // useUnifiedTopology: true, // No longer needed
      // useCreateIndex: true, // No longer needed
      // useFindAndModify: false, // No longer needed
      autoIndex: config.env === 'development', // Enable auto-indexing only in development
    });
    const message = '✅ Database connection successful.';
    if (config.env === 'production') {
      logger.info(message);
    } else {
      console.log(message.green.bold);
    }
  } catch (error: any) {
    const message = '❌ Failed to connect to database!';
    if (config.env === 'production') {
      errorLogger.error(message, error);
    } else {
      console.error(message.red.bold, error.message);
    }
    process.exit(1); // Exit if DB connection fails on startup
  }
}

// --- Start Server ---
async function startServer() {
  await connectDatabase(); // Ensure DB is connected before starting server

  // Create necessary upload directories
  createUploadDirectories(); // Define this function in utils/fileUtils.ts

  // Conditional server creation: HTTPS if cert files exist and HTTPS=true, otherwise HTTP
  const certDir = path.resolve(__dirname, '../cert');
  const certPath = path.join(certDir, 'server.cert');
  const keyPath = path.join(certDir, 'server.key');
  const useHttps = config.https === 'true' || config.https === true; // Check config

  try {
    if (useHttps && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };
        server = https.createServer(httpsOptions, app);
        console.log("Attempting to start HTTPS server...".yellow);
    } else {
        if(useHttps) {
             console.warn("HTTPS configured but certificate files ('server.cert', 'server.key') not found in 'cert' directory.".yellow);
        }
        console.log("Starting HTTP server...".yellow);
        server = http.createServer(app);
    }

    server.listen(config.port, () => {
      updateServerTime(); // For server monitor
      const serverType = server instanceof https.Server ? 'HTTPS' : 'HTTP'; // Define serverType first
      const message = \`🚀 Server (\${serverType}) running on port \${config.port} [\${config.env}]\`; // Now use serverType      if (config.env === 'production') {
        logger.info(message);
      } else {
        console.log(message.cyan.bold.underline);
      }
    });

  } catch (err: any) {
     const message = \`❌ Server startup error on port \${config.port}\`;
      if (config.env === 'production') {
          errorLogger.error(message, err);
      } else {
          console.error(message.red.bold, err.message);
          console.error(err.stack);
      }
      process.exit(1);
  }

}

// --- Graceful Shutdown ---
const shutdown = async (signal: string) => {
  console.log(\`\n👋 \${signal} signal received. Shutting down gracefully...\`.yellow);
  if (server) {
    server.close(async () => {
      console.log('✅ HTTP server closed.');
      try {
        await mongoose.connection.close(false); // Mongoose returns promise
        console.log('✅ MongoDB connection closed.');
        process.exit(0); // Exit successfully
      } catch (err: any) {
        const message = '❌ Error closing MongoDB connection during shutdown.';
         if (config.env === 'production') {
            errorLogger.error(message, err);
         } else {
             console.error(message.red, err.message);
         }
        process.exit(1); // Exit with error
      }
    });
  } else {
     console.log('Server not initialized, exiting.');
     process.exit(0);
  }

  // Force shutdown if graceful fails
  setTimeout(() => {
    const message = '⚠️ Could not close connections in time, forcefully shutting down';
     if (config.env === 'production') {
        errorLogger.warn(message);
     } else {
        console.warn(message.yellow);
     }
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (reason: Error | any) => {
    const message = \`\🚨 Unhandled Rejection! Shutting down...\n\${reason?.name || 'Error'}: \${reason?.message || reason}\`;
    if (config.env === 'production') {
        errorLogger.error(message, reason);
    } else {
        console.error(message.red.bold);
        // console.error(reason?.stack); // Optionally log stack in dev
    }
    // Graceful shutdown for unhandled rejections
    if (server) {
        shutdown('unhandledRejection');
    } else {
        process.exit(1); // Exit immediately if server not even started
    }
});

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // For Ctrl+C

// Start the application
startServer();
`);

addFile('src/config/index.ts', `
// src/config/index.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // ES Module alternative for __dirname

// Determine the environment and load the appropriate .env file
const envPath = process.env.NODE_ENV === 'production'
    ? path.resolve(process.cwd(), '.env.production') // Example: use .env.production
    : path.resolve(process.cwd(), '.env'); // Default to .env

dotenv.config({ path: envPath });
// Fallback to default .env if specific one doesn't exist
if (!fs.existsSync(envPath) && envPath.endsWith('.production')) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10), // Default to 3001 if not set
  server_name: process.env.SERVER_NAME || 'star-connect-backend-ts',
  allowed_origins: process.env.ALLOWED_ORIGINS, // Comma-separated string
  database_url: process.env.MONGODB_URI as string, // Ensure MONGODB_URI is set
  test_database_url: process.env.TEST_DATABASE_URL,
  https: process.env.HTTPS === 'true', // Convert 'true' string to boolean

  jwt: {
    secret: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set
    expires_in: process.env.TOKEN_EXPIRATION || '1h', // Use TOKEN_EXPIRATION from .env
    refresh_secret: process.env.JWT_REFRESH_SECRET as string, // Ensure JWT_REFRESH_SECRET is set
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  livekit: {
      api_key: process.env.LIVEKIT_API_KEY,
      api_secret: process.env.LIVEKIT_API_SECRET,
      url: process.env.LIVEKIT_URL, // Optional, only needed for server-side SDK calls
  },

  payment: {
      sslcommerz: {
          store_id: process.env.SSLCOMMERZ_STORE_ID,
          store_password: process.env.SSLCOMMERZ_STORE_PASSWORD,
          is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true',
          // Base URLs - specific endpoints are usually appended in the service
          api_url: process.env.SSLCOMMERZ_IS_LIVE === 'true'
                   ? process.env.SSLCOMMERZ_API_URL_LIVE
                   : process.env.SSLCOMMERZ_API_URL_SANDBOX,
          // Callback URLs - ensure consistency with .env
          success_url: \`\${process.env.BACKEND_URL}/api/v1/payments/success\`, // Route might need transactionId param
          fail_url: \`\${process.env.BACKEND_URL}/api/v1/payments/fail\`,
          cancel_url: \`\${process.env.BACKEND_URL}/api/v1/payments/cancel\`,
          ipn_url: \`\${process.env.BACKEND_URL}/api/v1/payments/notify/sslcommerz\`,
      },
      // Add other gateways like Stripe here if needed
      // stripe: { secret_key: process.env.STRIPE_SECRET_KEY }
  },

  email: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: parseInt(process.env.SMTP_PORT || '587', 10), // Default to 587 if not set
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    // smtp_service: process.env.SMTP_SERVICE, // Alternatively use service name for nodemailer
    email_from: process.env.EMAIL_FROM || '"Star Connect" <no-reply@example.com>',
  },

  rate_limit_window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '300000', 10), // Default 5 mins
  rate_limit_max_requests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300', 10), // Default 300

  // Add other configurations as needed
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3001',
  backend_url: process.env.BACKEND_URL || \`http://localhost:\${parseInt(process.env.PORT || '3001', 10)}\`

};

// Validate essential configurations
if (!config.database_url) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in the environment variables.".red.bold);
  process.exit(1);
}
if (!config.jwt.secret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the environment variables.".red.bold);
  process.exit(1);
}
if (!config.jwt.refresh_secret) {
  console.error("FATAL ERROR: JWT_REFRESH_SECRET is not defined in the environment variables.".red.bold);
  process.exit(1);
}
// Add more checks for essential variables (LiveKit, SSLCommerz keys in production maybe)

export default config;
`);

addFile('src/db.ts', `
// src/db.ts - Mongoose Connection Setup
import mongoose from 'mongoose';
import config from './config/index.js'; // Use .js extension
import { logger, errorLogger } from './shared/logger.js'; // Use .js extension

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true); // Recommended practice for Mongoose 7+

    await mongoose.connect(config.database_url, {
        dbName: \`\${config.server_name}-db\`,
        autoIndex: config.env === 'development', // Enable auto-indexing only in dev
        // Optional: Add server selection timeout if needed
        // serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    const message = '✅ MongoDB connected successfully.';
    if (config.env !== 'test') { // Avoid logging during tests
      if (config.env === 'production') {
        logger.info(message);
      } else {
        console.log(message.green);
      }
    }

    // Optional: Log connection events
    mongoose.connection.on('error', (err) => {
      const errMsg = 'MongoDB connection error after initial connection:';
      if (config.env === 'production') {
          errorLogger.error(errMsg, err);
      } else {
          console.error(errMsg.red, err);
      }
    });

    mongoose.connection.on('disconnected', () => {
      const warnMsg = 'MongoDB disconnected!';
       if (config.env === 'production') {
            logger.warn(warnMsg);
       } else {
           console.warn(warnMsg.yellow);
       }
    });

  } catch (error: any) {
    const errMsg = '❌ Initial MongoDB connection error:';
    if (config.env === 'production') {
      errorLogger.error(errMsg, error);
    } else {
      console.error(errMsg.red, error.message);
    }
    process.exit(1); // Exit process with failure on initial connection error
  }
};

export default connectDB;
`);
// =============================================
// PART 2: MIDDLEWARE, UTILS, HELPERS, SHARED
// =============================================
console.log('\nDefining middleware, utils, helpers, and shared files...');

// --- Middlewares ---
addFile('src/app/middlewares/globalErrorHandler.ts', `
// src/app/middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../../config/index.js'; // Use .js extension
import AppError from '../../utils/AppError.js'; // Use .js extension
import { IGenericErrorMessage } from '../../interfaces/error.js'; // Use .js extension
import handleValidationError from '../../errors/handleValidationError.js'; // Use .js extension
import handleZodError from '../../errors/handleZodError.js'; // Use .js extension
import handleCastError from '../../errors/handleCastError.js'; // Use .js extension
import { errorLogger } from '../../shared/logger.js'; // Use .js extension

const globalErrorHandler = (
  err: any, // Use 'any' for broader compatibility with different error types initially
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  // Log the error
  if (config.env === 'development') {
    console.error('Error 💥:', err);
  } else {
     errorLogger.error('Unhandled Error:', err); // Use Winston for production logging
  }

  let statusCode = 500;
  let message = 'Something went very wrong!';
  let errorMessages: IGenericErrorMessage[] = [];
  let stack = config.env === 'development' ? err?.stack : undefined;

  // Determine error type and format response
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
     // Keep original stack in dev for AppError if needed, controlled by stack assignment above
  } else if (err?.code === 11000) { // Mongoose duplicate key error
      // Extract field name and value more reliably
      const fieldMatch = err.message.match(/index: (.+?)_1/);
      const valueMatch = err.message.match(/dup key: { (.+?): "(.+?)" }/);
      const field = fieldMatch ? fieldMatch[1] : 'field';
      const value = valueMatch ? valueMatch[2] : 'value';
      message = \`Duplicate \${field} value: "\${value}". Please use another value!\`;
      errorMessages = [{ path: field, message }];
      statusCode = 400; // Bad Request
  } else if (err instanceof Error) {
      message = err.message || message; // Use Error's message
      errorMessages = [{ path: '', message: message }];
       // Stack is already set based on environment
  }
   // Handle JWT errors separately if needed (could also be done in auth middleware)
   else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
        errorMessages = [{ path: 'token', message }];
   } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
        errorMessages = [{ path: 'token', message }];
   }


  // Send the response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: stack, // Conditionally include stack trace
  });
};

export default globalErrorHandler;
`);

addFile('src/app/middlewares/apiNotFoundHandler.ts', `
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
        message: \`API endpoint '\${req.method} \${req.originalUrl}' not found on this server\`,
      },
    ],
  });
};

export default apiNotFoundHandler;
`);

addFile('src/app/middlewares/auth.middleware.ts', `
// src/app/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';

import config from '../../config/index.js'; // Use .js
import AppError from '../../utils/AppError.js'; // Use .js
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import User from '../modules/User/User.model.js'; // Use .js - Adjust path based on actual User model location

// Assuming IUser is defined in User.interface.ts and imported in User.model.ts
import { IUser } from '../modules/User/User.interface.js'; // Use .js

// Extend Express Request interface to attach user
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Attach the full user document
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) { // Check for token in cookies as fallback
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', httpStatus.UNAUTHORIZED));
  }

  // 2) Verification token
  let decoded: JwtPayload;
  try {
    // Use the correct secret from config
    decoded = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;

    // Check if decoded payload has user ID (adjust 'id' if your payload uses a different key)
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new Error('Invalid token payload');
    }
  } catch (err: any) {
    const message = err.name === 'TokenExpiredError'
        ? 'Your token has expired! Please log in again.'
        : 'Invalid token. Please log in again.';
    return next(new AppError(message, httpStatus.UNAUTHORIZED));
  }


  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', httpStatus.UNAUTHORIZED));
  }

  // 4) Check if user is active (optional)
   if (!currentUser.isActive) {
        return next(new AppError('User account is inactive.', httpStatus.UNAUTHORIZED));
   }

  // 5) Check if user changed password after the token was issued (Optional but recommended)
  // Requires adding a 'passwordChangedAt' field to the User model
  // if (currentUser.passwordChangedAt && decoded.iat) {
  //    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
  //    if (changedTimestamp > decoded.iat) {
  //        return next(new AppError('User recently changed password! Please log in again.', httpStatus.UNAUTHORIZED));
  //    }
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // Attach user document to the request object
  res.locals.user = currentUser; // Also make available in templates if needed (for EJS)
  next();
});

// Middleware to restrict routes to specific roles
// Ensure 'roles' property exists on your IUser interface and User model
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // protect middleware should run first and attach req.user
    if (!req.user || !req.user.roles || !req.user.roles.some(role => allowedRoles.includes(role))) {
        return next(new AppError('You do not have permission to perform this action.', httpStatus.FORBIDDEN)); // 403 Forbidden
    }
    next(); // User has one of the allowed roles
  };
};

`);

addFile('src/app/middlewares/validateRequest.ts', `
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
`);

// --- Errors ---
addFile('src/errors/ApiError.ts', `
// src/errors/ApiError.ts - Renamed to AppError.ts (using that name in global handler)
// Content moved to src/utils/AppError.ts
export {}; // Keep file to avoid breaking imports if not deleted immediately
`);

addFile('src/errors/handleValidationError.ts', `
// src/errors/handleValidationError.ts
import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js
import httpStatus from 'http-status';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path || '', // Ensure path is a string
        message: el?.message || 'Validation failed',
      };
    }
  );

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
`);

addFile('src/errors/handleCastError.ts', `
// src/errors/handleCastError.ts
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path || '', // Ensure path is a string
      message: \`Invalid \${error.path || 'ID'}: \${error.value}\`, // More specific message
    },
  ];

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Invalid ID / Cast Error', // Clearer message
    errorMessages: errors,
  };
};

export default handleCastError;
`);

addFile('src/errors/handleZodError.ts', `
// src/errors/handleZodError.ts
import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js
import httpStatus from 'http-status';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      // Use the last element of the path array for a cleaner field name
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message,
    };
  });

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
`);

// --- Utils ---
addFile('src/utils/AppError.ts', `
// src/utils/AppError.ts
/**
 * Custom error class for operational errors (errors we anticipate and handle).
 * Extends the built-in Error class.
 */
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  /**
   * Creates an instance of AppError.
   * @param message - The error message.
   * @param statusCode - The HTTP status code (defaults to 500 if not provided or invalid).
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Determine status based on statusCode (4xx = 'fail', 5xx = 'error')
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    // Mark this error as operational (expected, not a bug)
    this.isOperational = true;

    // Capture the stack trace correctly, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
`);

addFile('src/utils/catchAsync.ts', `
// src/utils/catchAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler or middleware function to catch any promise rejections
 * and pass them to the Express global error handler (via next(err)).
 *
 * @param fn The async RequestHandler function to wrap.
 * @returns A standard Express RequestHandler function.
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure the function call is awaited and errors are caught
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
`);

addFile('src/utils/fileUtils.ts', `
// src/utils/fileUtils.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'colors';

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Checks and creates necessary directories for file uploads.
 * @param baseDir Optional: Relative path from project root for the base upload directory (defaults to 'uploadFile').
 * @param folders Optional: Array of subfolder names to create within the base directory.
 */
export function createUploadDirectories(
    baseDir: string = 'uploadFile',
    folders: string[] = ['images', 'audios', 'pdfs', 'videos', 'docs', 'others', 'temp'] // Added 'temp'
): void {
    const defaultFolders: string[] = ['images', 'audios', 'pdfs', 'videos', 'docs', 'others', 'temp'];
    const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/utils
    const finalBaseDir = path.join(projectRoot, baseDir);
    const finalFolders = folders || defaultFolders;

    try {
        // Check if base directory exists, if not create it
        if (!fs.existsSync(finalBaseDir)) {
            fs.mkdirSync(finalBaseDir, { recursive: true });
            console.log(\`Created base upload directory: \${finalBaseDir}\`.magenta);
        }

        // Iterate through the subfolders and create them if they don't exist
        finalFolders.forEach(folder => {
            const folderPath = path.join(finalBaseDir, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(\`  Created upload subfolder: \${folderPath}\`.green);
            }
        });
    } catch (error) {
        console.error(\`Error creating upload directories in \${finalBaseDir}:\`.red, error);
    }
}

// You could add other file utility functions here, like deleting files:
/**
 * Deletes a file specified by its path relative to the project root.
 * @param filePath Relative path to the file from the project root (e.g., 'uploadFile/images/image.jpg').
 */
export const deleteFile = (filePath: string): void => {
  const projectRoot = path.resolve(__dirname, '../../');
  const absolutePath = path.join(projectRoot, filePath);
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.warn(\`File not found for deletion: \${absolutePath}\`.yellow);
      return;
    }
    fs.unlink(absolutePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(\`Error deleting file: \${absolutePath}\`.red, unlinkErr);
      } else {
        console.log(\`Successfully deleted file: \${absolutePath}\`.grey);
      }
    });
  });
};

`);

addFile('src/utils/swagger.ts', `
// src/utils/swagger.ts
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js'; // Use .js

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic Swagger definition
// You should expand this with more details about your API
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: \`\${config.server_name} API Documentation\`,
    version: '1.0.0', // Update version as needed
    description: \`API endpoints for the \${config.server_name} application.\`,
    license: {
      name: 'ISC', // Match your package.json license
      // url: 'Your license URL here',
    },
    contact: {
      name: 'Your Name/Company',
      // url: 'Your website',
      // email: 'Your email',
    },
  },
  servers: [
    {
      url: \`http://localhost:\${config.port}/api/v1\`, // Development server
      description: 'Development Server',
    },
    // Add production server URL if applicable
    // {
    //   url: 'Your Production URL/api/v1',
    //   description: 'Production Server',
    // }
  ],
   components: {
    securitySchemes: {
      bearerAuth: { // Name for the security scheme
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, for documentation purposes
        description: 'Enter JWT Bearer token **_only_**',
      },
    },
    // Define common schemas here if needed
    // schemas: {
    //   ErrorResponse: {
    //     type: 'object',
    //     properties: {
    //       success: { type: 'boolean', example: false },
    //       message: { type: 'string' },
    //       errorMessages: {
    //         type: 'array',
    //         items: {
    //           type: 'object',
    //           properties: {
    //             path: { type: 'string' },
    //             message: { type: 'string' }
    //           }
    //         }
    //       },
    //       stack: { type: 'string', description: 'Only in development mode' }
    //     }
    //   }
    // }
  },
  security: [ // Apply the security scheme globally
    {
      bearerAuth: [], // Requires the 'bearerAuth' scheme defined above
    },
  ],
   tags: [ // Optional: Define tags for grouping routes
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management' },
        { name: 'Experts', description: 'Expert profile and services management' },
        { name: 'Bookings', description: 'Booking management' },
        { name: 'Payments', description: 'Payment processing' },
        { name: 'LiveKit', description: 'LiveKit related endpoints' },
        { name: 'Reviews', description: 'Review management' },
        { name: 'Notifications', description: 'Notification management' },
        // Add more tags as needed
    ],
};

// Options for swagger-jsdoc
const options: Options = {
  swaggerDefinition,
  // Path to the API docs (route files using JSDoc comments)
  // Adjust the glob pattern to match your route file locations
  apis: [
    path.join(__dirname, '../app/modules/**/*.route.ts'), // Route files using .ts
    path.join(__dirname, '../app/modules/**/*.route.js'), // Route files using .js (after build)
    // Add paths to interfaces/schemas if you define them there with JSDoc
    // path.join(__dirname, '../interfaces/**/*.ts'),
  ],
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJsdoc(options);

// Optional: Swagger UI options for customization
export const swaggerUiOptions = {
    // explorer: true, // Show the explorer search bar
    // customCss: '.swagger-ui .topbar { display: none }', // Hide the top bar
    customSiteTitle: \`\${config.server_name} API Docs\`,
    // Add other UI options here
};

`);

addFile('src/utils/serverMonitor.ts', `
// src/utils/serverMonitor.ts
// Based on the example from ready-serversMongoose
import { Request } from 'express';
import * as os from 'os';
import * as osUtils from 'os-utils'; // Note: os-utils might not be perfectly accurate
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'colors';

import config from '../config/index.js'; // Use .js
import { listLogFiles } from '../helpers/logUtils.js'; // Use .js - Needs to be created

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/utils

// --- State for Monitoring ---
let lastServerUpdateTime = new Date();
// Store response times in memory (replace with a more robust solution if needed)
// This array is populated by middleware in app.ts
// export let responseTimes: { route: string; time: number; label: string }[] = [];

// --- Helper Functions ---

/** Updates the last known server activity time */
export function updateServerTime() {
  lastServerUpdateTime = new Date();
}

/** Formats uptime in seconds to a readable string (e.g., "1d 2h 3m") */
function formatUptime(uptimeInSeconds: number): string {
  const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
  uptimeInSeconds %= (24 * 60 * 60);
  const hours = Math.floor(uptimeInSeconds / (60 * 60));
  uptimeInSeconds %= (60 * 60);
  const minutes = Math.floor(uptimeInSeconds / 60);
  return \`\${days}d \${hours}h \${minutes}m\`;
}

/** Formats a date into a relative time string (e.g., "5m ago") */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return \`\${seconds}s ago\`;
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
  return \`\${Math.floor(seconds / 86400)}d ago\`;
}

/** Generates HTML for CPU usage metrics */
function generateCpuUsageHtml(): Promise<string> {
  return new Promise((resolve) => {
    osUtils.cpuUsage((v: number) => { // v is CPU usage as a fraction (0 to 1)
      const totalCores = os.cpus().length;
      const cpuUsagePercentage = (v * 100).toFixed(2);
      const freePercentage = ((1 - v) * 100).toFixed(2);
      // Note: os-utils cpuUsage/free is system-wide, not per-core breakdown easily
      resolve(\`
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">\${cpuUsagePercentage}%</div>
            <div class="metric-label">CPU Usage</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">\${freePercentage}%</div>
            <div class="metric-label">CPU Free</div>
          </div>
           <div class="metric-card">
            <div class="metric-value">\${totalCores}</div>
            <div class="metric-label">Total Cores</div>
          </div>
        </div>
      \`);
    });
  });
}

/** Generates HTML for Memory usage metrics */
function generateMemoryUsageHtml(): string {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

     return \`
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">\${formatBytes(usedMem)}</div>
            <div class="metric-label">Memory Used</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">\${formatBytes(freeMem)}</div>
            <div class="metric-label">Memory Free</div>
          </div>
           <div class="metric-card">
            <div class="metric-value">\${formatBytes(totalMem)}</div>
            <div class="metric-label">Total Memory</div>
          </div>
        </div>
      \`;
}

/** Generates HTML table for recent API response times */
function generateResponseTimesTable(
    times: { route: string; time: number; label: string }[]
): string {
  if (!times || times.length === 0) {
    return '<p>No recent API response time data available.</p>';
  }

  // Get the last N entries (e.g., last 20)
  const recentTimes = times.slice(-20).reverse(); // Show most recent first

  let tableHtml = \`
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Time (ms)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  \`;

  recentTimes.forEach(entry => {
    let statusClass = 'status-success'; // Low
    if (entry.label === 'Medium') statusClass = 'status-warning';
    if (entry.label === 'High') statusClass = 'status-error';

    tableHtml += \`
      <tr>
        <td>\${entry.route}</td>
        <td>\${entry.time}ms</td>
        <td><span class="status \${statusClass}"></span>\${entry.label}</td>
      </tr>
    \`;
  });

  tableHtml += \`
        </tbody>
      </table>
    </div>
  \`;

  return tableHtml;
}

/** Generates HTML section linking to log files */
function generateLogLinksHtml(): string {
  const errorLogs = listLogFiles('errors'); // Assumes function exists in helpers/logUtils.ts
  const successLogs = listLogFiles('successes'); // Use 'successes' to match logger setup

  const createLinks = (logs: string[], type: 'errors' | 'successes') => {
    if (!logs || logs.length === 0) return \\\`<p>No $\\{type} logs found.</p>\\\`;
    return logs
      .map(file => \`<a href="/logs/\${type}/\${file}" target="_blank" class="log-link">\${file}</a>\`)
      .join('<br>');
  };

  return \`
    <div class="log-container">
      <div class="log-section">
        <h3 style="color: #dc3545;">Error Logs</h3>
        <div class="log-links error-logs">\${createLinks(errorLogs, 'errors')}</div>
      </div>
      <div class="log-section">
        <h3 style="color: #28a745;">Success Logs</h3>
        <div class="log-links success-logs">\${createLinks(successLogs, 'successes')}</div>
      </div>
      <style>
        /* Styles from ready-serversMongoose example */
         .log-container { display: flex; gap: 2rem; margin: 1rem 0; flex-wrap: wrap;}
         .log-section { flex: 1; min-width: 250px; padding: 1rem; background: #1a1a1f; border-radius: 8px; border: 1px solid var(--border); }
         .log-links { margin-top: 1rem; max-height: 200px; overflow-y: auto; }
         .log-link { display: block; color: #aaa; text-decoration: none; margin: 0.25rem 0; padding: 0.25rem 0.5rem; border-radius: 4px; transition: background-color 0.2s; word-break: break-all; }
         .log-link:hover { background-color: #2a2a2f; text-decoration: underline; color: #eee; }
         .error-logs .log-link:hover { color: #ff8a8a; }
         .success-logs .log-link:hover { color: #8aff8a; }
      </style>
    </div>
  \`;
}


// --- Main HTML Generation ---
async function serverMonitorPage(
    req: Request,
    responseTimes: { route: string; time: number; label: string }[]
): Promise<string> {
  const cpuUsageHtml = await generateCpuUsageHtml();
  const memoryUsageHtml = generateMemoryUsageHtml();
  const responseTimesTableHtml = generateResponseTimesTable(responseTimes);
  const logLinksHtml = generateLogLinksHtml();
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;
  const uptime = os.uptime();
  const hostname = os.hostname();
  const cpuModel = os.cpus()[0]?.model || 'N/A';

  return \`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>\${config.server_name} - System Monitor</title>
        <style>
          /* Styles adapted from ready-serversMongoose example */
          :root {
            --bg-primary: #0f0f14; --bg-secondary: #1a1a1f; --accent: #00e5ff;
            --text-primary: #e0e0e0; --text-secondary: #a0a0a0; --border: #303035;
            --status-success: #00ff88; --status-warning: #ffdd00; --status-error: #ff5555;
            --space-sm: 0.5rem; --space-md: 1rem; --space-lg: 1.5rem; --glow: 0 0 8px var(--accent);
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; padding: var(--space-md); line-height: 1.5; }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { margin-bottom: var(--space-lg); padding: var(--space-lg); border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
          .header::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent); box-shadow: var(--glow); animation: scan 3s linear infinite; }
          @keyframes scan { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .header-title { margin-bottom: var(--space-sm); display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap;}
          .header-title h1 { color: var(--accent); font-size: 1.8em; margin-right: var(--space-md); text-shadow: 0 0 5px var(--accent); }
          .server-status { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9em; color: var(--status-success); animation: pulse 1.5s infinite ease-in-out; display: inline-flex; align-items: center; }
          .server-status::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background: var(--status-success); margin-right: var(--space-sm); box-shadow: 0 0 5px var(--status-success); }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          .header-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--border); }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
          .meta-value { color: var(--text-primary); font-size: 0.95rem; font-weight: 500; word-break: break-word; }
          .api-docs-link { display: inline-block; margin-top: var(--space-md); background-color: var(--accent); color: var(--bg-primary); padding: 0.4rem 0.8rem; border-radius: 4px; text-decoration: none; font-weight: 500; transition: background-color 0.2s; }
          .api-docs-link:hover { background-color: #00c4dd; }
          .tabs { margin-bottom: var(--space-lg); }
          .tab-nav { display: flex; gap: 1px; margin-bottom: -1px; overflow-x: auto; }
          .tab-button { padding: var(--space-sm) var(--space-md); background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); border-bottom: none; border-radius: 4px 4px 0 0; cursor: pointer; flex-shrink: 0; text-align: center; font-family: inherit; font-size: 0.9em; position: relative; transition: color 0.2s, background-color 0.2s; }
          .tab-button:hover { color: var(--accent); }
          .tab-button.active { background: var(--bg-primary); color: var(--accent); border-bottom: 1px solid var(--bg-primary); }
          .tab-button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--accent); box-shadow: var(--glow); }
          .tab-content { display: none; padding: var(--space-lg); background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 0 0 8px 8px; }
          .tab-content.active { display: block; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md); }
          .metric-card { background: var(--bg-primary); padding: var(--space-md); border: 1px solid var(--border); border-radius: 4px; text-align: center; }
          .metric-value { font-size: 1.6rem; color: var(--accent); text-shadow: var(--glow); margin-bottom: var(--space-sm); }
          .metric-label { color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; }
          .table-wrapper { overflow-x: auto; margin-top: var(--space-md); }
          .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
          .data-table th, .data-table td { padding: var(--space-sm) var(--space-md); text-align: left; border-bottom: 1px solid var(--border); }
          .data-table th { color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; }
          .data-table tr:hover { background: rgba(0, 229, 255, 0.05); }
          .status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: var(--space-sm); }
          .status-success { background: var(--status-success); box-shadow: 0 0 5px var(--status-success); }
          .status-warning { background: var(--status-warning); box-shadow: 0 0 5px var(--status-warning); }
          .status-error { background: var(--status-error); box-shadow: 0 0 5px var(--status-error); }
          h2 { margin-top: var(--space-lg); margin-bottom: var(--space-md); color: var(--text-secondary); font-size: 1.2em; border-bottom: 1px solid var(--border); padding-bottom: var(--space-sm); }
          h3 { color: var(--accent); font-size: 1em; margin-bottom: var(--space-sm); }
          p { margin-bottom: var(--space-md); }
          @media (max-width: 768px) { .header-title { flex-direction: column; align-items: flex-start; } .metric-value { font-size: 1.3rem; } .data-table { font-size: 0.8rem; } }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab-button');
            const contents = document.querySelectorAll('.tab-content');
            if(tabs.length > 0 && contents.length > 0) {
                tabs[0].classList.add('active');
                contents[0].classList.add('active');
            }
            tabs.forEach((tab, index) => {
              tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                if(contents[index]) contents[index].classList.add('active');
              });
            });
            // Auto-refresh functionality (optional)
            // setInterval(() => { window.location.reload(); }, 30000); // Refresh every 30 seconds
          });
        </script>
      </head>
      <body>
        <div class="container">
          <header class="header">
             <div class="header-title">
               <h1>\${config.server_name} Monitor_</h1>
               <div class="server-status"><span>Running</span></div>
             </div>
             <p>Environment: \${config.env} | Node: \${nodeVersion}</p>
             <a class="api-docs-link" href="/api-docs" target="_blank">API Docs (Swagger)</a>
             <div class="header-meta">
                <div class="meta-item"><span class="meta-label">Hostname</span><span class="meta-value">\${hostname}</span></div>
                <div class="meta-item"><span class="meta-label">Platform</span><span class="meta-value">\${platform} (\${arch})</span></div>
                <div class="meta-item"><span class="meta-label">CPU</span><span class="meta-value">\${cpuModel}</span></div>
                <div class="meta-item"><span class="meta-label">Uptime</span><span class="meta-value">\${formatUptime(uptime)}</span></div>
                <div class="meta-item"><span class="meta-label">Last Activity</span><span class="meta-value">\${formatTimeAgo(lastServerUpdateTime)}</span></div>
             </div>
          </header>

          <div class="tabs">
            <div class="tab-nav">
              <button class="tab-button">System Usage</button>
              <button class="tab-button">API History</button>
              <button class="tab-button">Logs</button>
            </div>
            <div class="tab-content">
              <h2>CPU Usage</h2>
              \${cpuUsageHtml}
              <h2>Memory Usage</h2>
              \${memoryUsageHtml}
            </div>
            <div class="tab-content">
              <h2>Recent API Response Times</h2>
              \${responseTimesTableHtml}
            </div>
            <div class="tab-content">
              <h2>Log Files</h2>
              \${logLinksHtml}
            </div>
          </div>

        </div>
      </body>
    </html>
  \`;
}

export default serverMonitorPage;
`);

// --- Shared ---
addFile('src/shared/catchAsync.ts', `
// src/shared/catchAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler or middleware function to catch any promise rejections
 * and pass them to the Express global error handler (via next(err)).
 *
 * @param fn The async RequestHandler function to wrap.
 * @returns A standard Express RequestHandler function.
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure the function call is awaited and errors are caught
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
`);

addFile('src/shared/logger.ts', `
// src/shared/logger.ts
import winston, { format, transports } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config/index.js'; // Use .js

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/shared

const { combine, timestamp, label, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, label: lbl, timestamp: ts, stack }) => {
  const logLabel = lbl || 'App';
  const logTimestamp = ts || new Date().toISOString();
  // Include stack trace in the log message if present
  const logMessage = stack ? \`\${message}\nStack: \${stack}\` : message;
  return \`\${logTimestamp} [\${logLabel}] \${level}: \${logMessage}\`;
});

// --- Success Logger ---
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info', // Log level based on environment
  format: combine(
    colorize(),
    label({ label: config.server_name }),
    timestamp(),
    errors({ stack: true }), // Capture stack traces
    logFormat
  ),
  transports: [
    // Console transport (only in development)
    ...(config.env === 'development' ? [new transports.Console()] : []),

    // Daily rotating file transport for success/info logs
    new DailyRotateFile({
      filename: path.join(projectRoot, 'logs', 'winston', 'successes', '%DATE%-success.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // Max size of each log file
      maxFiles: '7d', // Keep logs for 7 days
      level: 'info', // Log 'info' and above ('warn', 'error')
    }),
  ],
  // Handle exceptions (optional, process listeners in server.ts are often preferred)
  // exceptionHandlers: [
  //   new DailyRotateFile({
  //     filename: path.join(projectRoot, 'logs', 'winston', 'exceptions', '%DATE%-exceptions.log'),
  //     datePattern: 'YYYY-MM-DD',
  //     zippedArchive: true,
  //     maxSize: '20m',
  //     maxFiles: '14d',
  //   }),
  // ],
  // exitOnError: false, // Do not exit on handled exceptions
});

// --- Error Logger ---
const errorLogger = winston.createLogger({
  level: 'error', // Only log errors
  format: combine(
    colorize(), // Optional: Colorize errors in console during dev
    label({ label: config.server_name }),
    timestamp(),
    errors({ stack: true }), // Ensure stack traces are included for errors
    logFormat
  ),
  transports: [
    // Console transport for errors (useful in development)
     ...(config.env === 'development' ? [new transports.Console()] : []),

    // Daily rotating file transport for error logs
    new DailyRotateFile({
      filename: path.join(projectRoot, 'logs', 'winston', 'errors', '%DATE%-error.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keep error logs for 14 days
    }),
  ],
   // Handle uncaught exceptions specifically for errors
   exceptionHandlers: [
      new DailyRotateFile({
        filename: path.join(projectRoot, 'logs', 'winston', 'exceptions', '%DATE%-exceptions.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
      // Optionally log exceptions to console in dev
      ...(config.env === 'development' ? [new transports.Console()] : []),
    ],
   exitOnError: false, // Do not exit on handled exceptions (let server.ts handle process exit)
});


export { logger, errorLogger };

`);

addFile('src/shared/pick.ts', `
// src/shared/pick.ts
/**
 * Creates an object composed of the picked object properties.
 * @param obj The source object.
 * @param keys The property keys to pick.
 * @returns A new object with the picked properties.
 */
const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    // Check if the object is not null/undefined and has the key
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
`);

addFile('src/shared/sendResponse.ts', `
// src/shared/sendResponse.ts
import { Response } from 'express';

// Interface for a standard API success response
export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    // Add other meta fields if needed (e.g., totalPages)
  } | null;
  data?: T | null;
}

/**
 * Sends a standardized JSON success response.
 * @param res Express Response object.
 * @param data Object containing response details (statusCode, success, message, meta, data).
 */
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null, // Default to null if message is not provided
    meta: data.meta || null,     // Default to null if meta is not provided
    data: data.data || null,       // Default to null if data is not provided
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
`);

// --- Helpers ---
addFile('src/helpers/jwtHelpers.ts', `
// src/helpers/jwtHelpers.ts
import jwt, { SignOptions, VerifyOptions, JwtPayload, Secret } from 'jsonwebtoken';
import ms from 'ms';
import config from '../config/index.js'; // Use .js

/**
 * Creates a JWT token.
 * @param payload - The payload to include in the token (e.g., { id: userId }).
 * @param secret - The secret key to sign the token.
 * @param expiresIn - The expiration time (e.g., '1h', '7d').
 * @returns The generated JWT token.
 */
export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string
): string => {
   // Convert expiresIn string (like '1h') to seconds for jwt.sign
   const msFn = ms as unknown as (value: string) => number; // Type assertion for ms
   const expiresInSeconds = Math.floor(msFn(expiresIn) / 1000);

  const signOptions: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(payload, secret, signOptions);
};

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @param secret - The secret key used to sign the token.
 * @returns The decoded payload if the token is valid.
 * @throws {JsonWebTokenError | TokenExpiredError} If the token is invalid or expired.
 */
export const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload => {
  // jwt.verify throws an error if verification fails (invalid signature, expired)
  // No need for try-catch here, let the caller handle potential errors
  return jwt.verify(token, secret) as JwtPayload;
};

// Convenience functions using secrets from config
export const createAccessToken = (payload: Record<string, unknown>): string => {
    return createToken(payload, config.jwt.secret, config.jwt.expires_in);
};

export const createRefreshToken = (payload: Record<string, unknown>): string => {
    return createToken(payload, config.jwt.refresh_secret, config.jwt.refresh_expires_in);
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return verifyToken(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return verifyToken(token, config.jwt.refresh_secret);
};

`);

addFile('src/helpers/paginationHelper.ts', `
// src/helpers/paginationHelper.ts
import { SortOrder } from 'mongoose';

// Interface for pagination options received in request query
export interface IPaginationOptions {
  page?: number | string; // Allow string from query params
  limit?: number | string;
  sortBy?: string;
  sortOrder?: SortOrder | 'asc' | 'desc'; // Allow string 'asc'/'desc'
}

// Interface for calculated pagination values used in services/database queries
export interface ICalculatedPagination {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
}

/**
 * Calculates pagination parameters from request query options.
 * Provides defaults for page, limit, sortBy, and sortOrder.
 * @param options - Options object typically from req.query.
 * @returns Calculated pagination parameters including skip value.
 */
const calculatePagination = (
  options: IPaginationOptions
): ICalculatedPagination => {
  // Parse page and limit, providing defaults and ensuring they are positive integers
  const page = Math.max(1, Number(options.page || 1));
  const limit = Math.max(1, Number(options.limit || 10)); // Default limit: 10
  const skip = (page - 1) * limit;

  // Determine sort parameters
  const sortBy = options.sortBy || 'createdAt'; // Default sort by creation time
  // Default sort order: descending ('desc', -1)
  const sortOrder: SortOrder = options.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default calculatePagination;
`);

addFile('src/helpers/logUtils.ts', `
// src/helpers/logUtils.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/helpers

/**
 * Helper function to list log files from Winston directories.
 * @param logType - The type of logs ('successes' or 'errors').
 * @returns An array of log file names found.
 */
export const listLogFiles = (logType: 'successes' | 'errors'): string[] => {
  const logDir = path.join(projectRoot, 'logs', 'winston', logType);
  try {
    // Check if directory exists before reading
    if (!fs.existsSync(logDir)) {
        console.warn(\`Log directory not found: \${logDir}\`.yellow);
        return [];
    }
    // Read directory and filter for .log files
    return fs.readdirSync(logDir).filter((file) => file.endsWith('.log')).sort().reverse(); // Sort descending (newest first)
  } catch (err) {
    console.error(\`Failed to list \${logType} logs from \${logDir}:\`.red, err);
    return []; // Return empty array on error
  }
};

/**
 * Helper function to read the content of a specific log file.
 * @param logType - The type of logs ('successes' | 'errors').
 * @param filename - The name of the log file.
 * @returns The content of the log file as a string, or null if not found/error.
 */
export const readLogFileContent = (logType: 'successes' | 'errors', filename: string): string | null => {
    const logDir = path.join(projectRoot, 'logs', 'winston', logType);
    const filePath = path.join(logDir, filename);

    // Basic security check: ensure filename doesn't contain path traversal attempts
    if (filename.includes('..') || filename.includes('/')) {
        console.error(\`Attempted path traversal in log filename: \${filename}\`.red);
        return null;
    }

    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            console.warn(\`Log file not found: \${filePath}\`.yellow);
            return null;
        }
    } catch (err) {
        console.error(\`Failed to read log file \${filePath}:\`.red, err);
        return null;
    }
};
`);

addFile('src/helpers/emailSender.ts', `
// src/helpers/emailSender.ts
import nodemailer from 'nodemailer';
import config from '../config/index.js'; // Use .js
import AppError from '../utils/AppError.js'; // Use .js
import httpStatus from 'http-status';
import { errorLogger } from '../shared/logger.js'; // Use .js

export interface IEmailOptions {
  to: string; // Recipient email address
  subject: string;
  text?: string; // Plain text body
  html: string; // HTML body
  // You can add cc, bcc, attachments etc. here if needed
  // attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
}

/**
 * Sends an email using configured SMTP settings.
 * @param options - Email options including to, subject, text, and html.
 */
export const sendEmail = async (options: IEmailOptions): Promise<void> => {
  // 1. Create a transporter
  // Validate essential SMTP config
  if (!config.email.smtp_host || !config.email.smtp_port || !config.email.smtp_user || !config.email.smtp_pass || !config.email.email_from) {
     const errorMsg = 'SMTP configuration incomplete. Cannot send email.';
     errorLogger.error(errorMsg, { required: ['host', 'port', 'user', 'pass', 'email_from'] });
     // Decide whether to throw or just log depends on how critical email sending is
     throw new AppError(errorMsg, httpStatus.INTERNAL_SERVER_ERROR);
     // Or just: console.error(errorMsg); return;
  }

  const transporter = nodemailer.createTransport({
    host: config.email.smtp_host,
    port: config.email.smtp_port,
    auth: {
      user: config.email.smtp_user,
      pass: config.email.smtp_pass,
    },
    // secure: config.email.smtp_port === 465, // Use true for port 465, false for others like 587 or 2525
    // logger: config.env === 'development', // Log SMTP communication in dev
    // debug: config.env === 'development',
  });

  // 2. Define the email options
  const mailOptions = {
    from: config.email.email_from, // Use configured sender address
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    // attachments: options.attachments,
  };

  // 3. Actually send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    if (config.env === 'development') {
      console.log('Email sent: %s'.cyan, info.messageId);
      // Preview URL for Mailtrap: console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error: any) {
    // Log the error for debugging
    errorLogger.error('Error sending email:', { to: options.to, subject: options.subject, error: error.message });
    // Throw a generic error to the caller, avoid exposing too much detail
    throw new AppError('There was an error sending the email. Please try again later.', httpStatus.INTERNAL_SERVER_ERROR);
  }
};
`);

// --- Interfaces (Common ones) ---
addFile('src/interfaces/common.ts', `
// src/interfaces/common.ts
import { IGenericErrorMessage } from './error.js'; // Use .js

// Standard structure for error responses handled by globalErrorHandler
export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
  stack?: string | undefined; // Included only in development
}

// Standard structure for responses containing paginated data
export interface IGenericDataResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    // totalPages?: number; // Optional: Calculate if needed
  };
  data: T;
}

// Generic type for request handlers using catchAsync
// (Already defined in catchAsync.ts, kept here for reference if needed)
// export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
`);

addFile('src/interfaces/error.ts', `
// src/interfaces/error.ts

// Structure for individual error messages within an error response
export interface IGenericErrorMessage {
  path: string | number; // Field name or index causing the error
  message: string;      // Description of the error
}
`);

addFile('src/interfaces/index.d.ts', `
// src/interfaces/index.d.ts
// Global type augmentation for Express Request

// Import IUser definition path based on your structure
import { IUser } from '../app/modules/User/User.interface.js'; // Use .js

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property, populated by auth middleware
    }
  }
}

// This ensures the file is treated as a module.
export {};
`);
// =============================================
// PART 3: MODULES, DEPLOYMENT & EXECUTION
// =============================================
console.log('\nDefining module files and deployment configurations...');

// --- Main Router Aggregator ---
addFile('src/app/routes/index.ts', `
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
`);

// --- Generate Module Files ---
modules.forEach(moduleName => {
    const lowerModuleName = lowerCaseFirst(moduleName);
    const capModuleName = capitalize(moduleName);

    // --- Model ---
    let modelContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { I${capModuleName} } from './${lowerModuleName}.interface.js'; // Use .js

const ${lowerModuleName}Schema: Schema<I${capModuleName}> = new Schema<I${capModuleName}>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const ${capModuleName} = mongoose.model<I${capModuleName}, Model<I${capModuleName}>>('${capModuleName}', ${lowerModuleName}Schema);

export default ${capModuleName};
`;
    // Override with specific model content if provided
    const specificModel = sampleFiles.find(f => f.filePath === `src/models/${capModuleName}.model.ts`);
    if (specificModel) {
        // Adjust imports and exports for the new location
        modelContent = specificModel.content
            .replace(/from '\.\/(.+?)\.model'/g, `from './$1.model.js'`) // Adjust relative model imports
            .replace(/export default (\w+);/, `export default ${capModuleName};\n\nexport { I${capModuleName} };`) // Export interface too maybe
            .replace(`// src/models/${capModuleName}.model.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.model.ts`); // Update comment path
    } else {
         // Default content already set
    }
    addFile(modulePath(capModuleName, `${lowerModuleName}.model.ts`), modelContent);

    // --- Interface ---
    let interfaceContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.interface.ts
import mongoose, { Document } from 'mongoose';

export interface I${capModuleName} extends Document {
  // Define interface properties based on the model or specific needs
  name: string;
  // Example relation
  // createdBy?: mongoose.Types.ObjectId; // Optional ObjectId type
  createdAt: Date;
  updatedAt: Date;
}
`;
    // Try to auto-generate basic interface from model content (simple regex approach)
    const modelPropsMatch = modelContent.match(/new Schema<I\w+>\(\{([\s\S]*?)\}/);
    if (modelPropsMatch && modelPropsMatch[1]) {
        const propsString = modelPropsMatch[1];
        const generatedProps = [];
        const propRegex = /(\w+):\s*\{\s*type:\s*(\w+).*?(required:\s*true)?/g;
        let match;
        while ((match = propRegex.exec(propsString)) !== null) {
            const [, propName, propTypeStr, required] = match;
            let tsType = 'any'; // Default type
            switch (propTypeStr) {
                case 'String': tsType = 'string'; break;
                case 'Number': tsType = 'number'; break;
                case 'Boolean': tsType = 'boolean'; break;
                case 'Date': tsType = 'Date'; break;
                case 'ObjectId': tsType = 'mongoose.Types.ObjectId'; break;
                case 'Mixed': tsType = 'any'; break;
                case 'Array': tsType = 'any[]'; break; // Basic array type
                 // Add more type mappings if needed
            }
            // Handle ObjectId refs better if possible? Maybe look for 'ref:'?
             const refMatch = propsString.substring(match.index).match(/ref:\s*'(\w+)'/);
             if(propTypeStr === 'ObjectId' && refMatch) {
                 // Could try importing the referenced interface, but complex for a script
                 // tsType = `I\${refMatch[1]}['_id']`; // This requires importing IRefModel
                 tsType = `mongoose.Types.ObjectId`; // Keep it simple
             }

            generatedProps.push(`  ${propName}${required ? '' : '?'}: ${tsType};`);
        }
        if (generatedProps.length > 0) {
         interfaceContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.interface.ts
import mongoose, { Document } from 'mongoose';
// Import referenced interfaces if needed, e.g.:
// import { IUser } from '../User/user.interface.js';

export interface I${capModuleName} extends Document {
${generatedProps.join('\n')}

  // Timestamps are added by Mongoose if { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
`;
        }
    }
     // Override with specific interface content if provided
     const specificInterface = sampleFiles.find(f => f.filePath === `src/models/${capModuleName}.interface.ts` || f.filePath === `src/interfaces/${capModuleName}.interface.ts`); // Check common locations
      if (specificInterface) {
        interfaceContent = specificInterface.content
            .replace(`// src/models/${capModuleName}.interface.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.interface.ts`)
            .replace(`// src/interfaces/${capModuleName}.interface.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.interface.ts`);
     }

    addFile(modulePath(capModuleName, `${lowerModuleName}.interface.ts`), interfaceContent);


    // --- Validation ---
    addFile(modulePath(capModuleName, `${lowerModuleName}.validation.ts`), `
// src/app/modules/${capModuleName}/${lowerModuleName}.validation.ts
import { z } from 'zod';

// Example: Basic validation for creation
const create${capModuleName}ValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: '${capModuleName} name is required' }).min(1),
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
const update${capModuleName}ValidationSchema = create${capModuleName}ValidationSchema.deepPartial();
// You might need more specific update schemas depending on which fields are allowed

export const ${capModuleName}Validation = {
  create${capModuleName}ValidationSchema,
  update${capModuleName}ValidationSchema,
};
`);

    // --- Service ---
    let serviceContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.service.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError.js'; // Use .js
import ${capModuleName} from './${lowerModuleName}.model.js'; // Use .js
import { I${capModuleName} } from './${lowerModuleName}.interface.js'; // Use .js
import { IPaginationOptions, ICalculatedPagination } from '../../interfaces/pagination.js'; // Use .js
import calculatePagination from '../../helpers/paginationHelper.js'; // Use .js
import { IGenericDataResponse } from '../../interfaces/common.js'; // Use .js
// import { User } from '../User/user.model.js' // Example import for population

// Example Service: Create a new document
export const create${capModuleName}Service = async (payload: Partial<I${capModuleName}>): Promise<I${capModuleName}> => {
  try {
    const result = await ${capModuleName}.create(payload);
    return result;
  } catch (error: any) {
    // Handle potential database errors (like duplicate keys)
    if (error.code === 11000) {
       throw new AppError(\`Duplicate key error: \${Object.keys(error.keyValue).join(', ')} must be unique.\`, httpStatus.BAD_REQUEST);
    }
    throw new AppError(\`Failed to create ${lowerModuleName}: \${error.message}\`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// Example Service: Get all documents with pagination
export const getAll${capModuleName}sService = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericDataResponse<I${capModuleName}[]>> => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  // Example sort object
  const sortCondition: { [key: string]: mongoose.SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  // Example query (adjust as needed)
  const whereCondition = {
      // Add filters here if needed, e.g., isActive: true
  };

  const [result, total] = await Promise.all([
    ${capModuleName}.find(whereCondition)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      // Example population: .populate('createdBy', 'name email')
      .lean(), // Use lean for performance if not modifying docs
    ${capModuleName}.countDocuments(whereCondition),
  ]);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Example Service: Get single document by ID
export const get${capModuleName}ByIdService = async (id: string): Promise<I${capModuleName} | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
  }
  const result = await ${capModuleName}.findById(id); //.populate('...');
  if (!result) {
        throw new AppError('${capModuleName} not found', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Update document by ID
export const update${capModuleName}Service = async (
  id: string,
  payload: Partial<I${capModuleName}>
): Promise<I${capModuleName} | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  // Add filtering for non-updatable fields if necessary
  // e.g., delete payload.createdAt; delete payload.updatedAt;

  const result = await ${capModuleName}.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });
   if (!result) {
        throw new AppError('${capModuleName} not found or update failed', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Delete document by ID
export const delete${capModuleName}Service = async (id: string): Promise<I${capModuleName} | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  const result = await ${capModuleName}.findByIdAndDelete(id);
   if (!result) {
        throw new AppError('${capModuleName} not found', httpStatus.NOT_FOUND);
  }
  // Optional: Add logic here to delete related data if necessary
  return result;
};

`;
    // Override with specific service content if provided
    const specificService = sampleFiles.find(f => f.filePath === `src/services/${lowerModuleName}.service.ts`);
     if (specificService) {
        // Adjust imports and exports for the new location
        serviceContent = specificService.content
            .replace(/from '\.\.\/models\/(.+?)\.model'/g, `from './$1.model.js'`) // Adjust model import paths
            .replace(/from '\.\.\/utils\/(\w+)'/g, `from '../../utils/$1.js'`) // Adjust utils import paths
            .replace(`// src/services/${lowerModuleName}.service.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.service.ts`); // Update comment path
        // Add specific service exports if needed (handled by module index later)
    }
    addFile(modulePath(capModuleName, `${lowerModuleName}.service.ts`), serviceContent);

    // --- Controller ---
     let controllerContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as ${lowerModuleName}Service from './${lowerModuleName}.service.js'; // Use .js
import { I${capModuleName} } from './${lowerModuleName}.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const create${capModuleName} = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await ${lowerModuleName}Service.create${capModuleName}Service(req.body);
  sendResponse<I${capModuleName}>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: '${capModuleName} created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAll${capModuleName}s = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await ${lowerModuleName}Service.getAll${capModuleName}sService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<I${capModuleName}[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${capModuleName}s retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const get${capModuleName}ById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ${lowerModuleName}Service.get${capModuleName}ByIdService(id);
  sendResponse<I${capModuleName}>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${capModuleName} retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const update${capModuleName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await ${lowerModuleName}Service.update${capModuleName}Service(id, payload);
  sendResponse<I${capModuleName}>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${capModuleName} updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const delete${capModuleName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ${lowerModuleName}Service.delete${capModuleName}Service(id);
  sendResponse<I${capModuleName}>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: '${capModuleName} deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});

`;
    // Override with specific controller content if provided
    const specificController = sampleFiles.find(f => f.filePath === `src/controllers/${lowerModuleName}.controller.ts`);
     if (specificController) {
        // Adjust imports and exports for the new location
        controllerContent = specificController.content
            .replace(/from '\.\.\/services\/(.+?)\.service'/g, `import * as $1Service from './$1.service.js'`) // Adjust service import
            .replace(/from '\.\.\/utils\/(\w+)'/g, `from '../../utils/$1.js'`) // Adjust utils import
            .replace(/from '\.\.\/shared\/(\w+)'/g, `from '../../shared/$1.js'`) // Adjust shared import
            .replace(/from '\.\.\/models\/(.+?)\.model'/g, `from './$1.model.js'`) // Adjust model import (if needed)
            .replace(/from '\.\.\/interfaces\/(\w+)'/g, `from '../../interfaces/$1.js'`) // Adjust common interfaces import
            .replace(/from '\.\.\/constants\/(\w+)'/g, `from '../../constants/$1.js'`) // Adjust constants import
            .replace(`// src/controllers/${lowerModuleName}.controller.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.controller.ts`) // Update comment path
            .replace(/require\('\.\.\/middlewares\/auth\.middleware'\)/g, `import * as authMiddleware from '../../middlewares/auth.middleware.js'`) // Adjust middleware import if require was used
            // Add specific controller exports if needed
            .replace(/export const (\w+)/g, `export const ${lowerModuleName}$1`); // Prefix exported functions for potential naming conflicts
    }
    addFile(modulePath(capModuleName, `${lowerModuleName}.controller.ts`), controllerContent);

    // --- Route ---
     let routeContent = `
// src/app/modules/${capModuleName}/${lowerModuleName}.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as ${lowerModuleName}Controller from './${lowerModuleName}.controller.js'; // Use .js
import { ${capModuleName}Validation } from './${lowerModuleName}.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: ${capModuleName}
 * description: ${capModuleName} management endpoints
 */

/**
 * @swagger
 * /${lowerModuleName}:
 * post:
 * summary: Create a new ${lowerModuleName}
 * tags: [${capModuleName}]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/${capModuleName}Create' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: ${capModuleName} created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(${capModuleName}Validation.create${capModuleName}ValidationSchema),
  ${lowerModuleName}Controller.create${capModuleName}
);

/**
 * @swagger
 * /${lowerModuleName}:
 * get:
 * summary: Retrieve a list of ${lowerModuleName}s
 * tags: [${capModuleName}]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: query
 * name: page
 * schema: { type: integer, default: 1 }
 * description: Page number
 * - in: query
 * name: limit
 * schema: { type: integer, default: 10 }
 * description: Results per page
 * - in: query
 * name: sortBy
 * schema: { type: string, default: createdAt }
 * description: Field to sort by
 * - in: query
 * name: sortOrder
 * schema: { type: string, enum: [asc, desc], default: desc }
 * description: Sort order
 * # Add other filter parameters here
 * responses:
 * 200:
 * description: A list of ${lowerModuleName}s
 */
router.get(
    '/',
    protect, // Example: Requires login
    ${lowerModuleName}Controller.getAll${capModuleName}s
);

/**
 * @swagger
 * /${lowerModuleName}/{id}:
 * get:
 * summary: Get a ${lowerModuleName} by ID
 * tags: [${capModuleName}]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The ${lowerModuleName} ID
 * responses:
 * 200:
 * description: ${capModuleName} details
 * 404:
 * description: ${capModuleName} not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    ${lowerModuleName}Controller.get${capModuleName}ById
);

/**
 * @swagger
 * /${lowerModuleName}/{id}:
 * patch:
 * summary: Update a ${lowerModuleName} by ID
 * tags: [${capModuleName}]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The ${lowerModuleName} ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/${capModuleName}Update' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: ${capModuleName} updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: ${capModuleName} not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(${capModuleName}Validation.update${capModuleName}ValidationSchema),
  ${lowerModuleName}Controller.update${capModuleName}
);

/**
 * @swagger
 * /${lowerModuleName}/{id}:
 * delete:
 * summary: Delete a ${lowerModuleName} by ID
 * tags: [${capModuleName}]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The ${lowerModuleName} ID
 * responses:
 * 200:
 * description: ${capModuleName} deleted successfully
 * 404:
 * description: ${capModuleName} not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  ${lowerModuleName}Controller.delete${capModuleName}
);

export default router;

`;
    // Override with specific route content if provided
    const specificRoute = sampleFiles.find(f => f.filePath === `src/routes/${lowerModuleName}.routes.ts`);
     if (specificRoute) {
        // Adjust imports and exports for the new location
        routeContent = specificRoute.content
            .replace(/from '\.\.\/controllers\/(.+?)\.controller'/g, `import * as $1Controller from './$1.controller.js'`) // Adjust controller import
            .replace(/from '\.\.\/middlewares\/(\w+)\.middleware'/g, `import * as $1Middleware from '../../middlewares/$1.middleware.js'`) // Adjust middleware import
            .replace(/from '\.\.\/middlewares\/(\w+)'/g, `import $1Middleware from '../../middlewares/$1.js'`) // Adjust default middleware import
            .replace(/from '\.\.\/(app\/)?modules\/(.+?)\/(\w+)\.validation'/g, `import { ${capitalize('$3')}Validation } from './$3.validation.js'`) // Adjust validation import
            .replace(`// src/routes/${lowerModuleName}.routes.ts`, `// src/app/modules/${capModuleName}/${lowerModuleName}.route.ts`); // Update comment path
    }
    addFile(modulePath(capModuleName, `${lowerModuleName}.route.ts`), routeContent);

}); // End modules.forEach

// --- Add Logs Module Routes/Controller (Specific Implementation) ---
addFile(modulePath('Logs', 'logs.controller.ts'), `
// src/app/modules/Logs/logs.controller.ts
import { Request, Response } from 'express';
import { listLogFiles, readLogFileContent } from '../../helpers/logUtils.js'; // Use .js
import httpStatus from 'http-status';
import path from 'path';

const renderLogListPage = (res: Response, logType: 'successes' | 'errors', files: string[]) => {
  const title = \`\${logType.charAt(0).toUpperCase() + logType.slice(1)} Logs\`;
  if (files.length === 0) {
    res.status(httpStatus.OK).send(\`<h1>\${title}</h1><p>No \${logType} logs available.</p><a href="/">Back to Monitor</a>\`);
  } else {
    const fileListHTML = files
      .map(file => \`<li><a href="/logs/\${logType}/\${encodeURIComponent(file)}">\${file}</a></li>\`)
      .join('');

    // Very basic HTML structure
    res.status(httpStatus.OK).send(\`
      <!DOCTYPE html><html><head><title>\${title}</title>
      <style>body{font-family: sans-serif; padding: 20px; background: #f4f4f4;} ul{list-style: none; padding: 0;} li{margin-bottom: 5px;} a{text-decoration: none; color: #007bff;} a:hover{text-decoration: underline;}</style>
      </head><body>
        <h1>\${title}</h1><ul>\${fileListHTML}</ul><br><a href="/">Back to Monitor</a>
      </body></html>
    \`);
  }
};

const renderLogContentPage = (res: Response, logType: 'successes' | 'errors', filename: string, content: string | null) => {
    const title = \`Log File: \${filename}\`;
    const backLink = \`/logs/\${logType}\`;
    let bodyContent: string;

    if (content === null) {
        res.status(httpStatus.NOT_FOUND);
        bodyContent = \`<h1>Log Not Found</h1><p>The log file \${filename} does not exist or could not be read.</p>\`;
    } else {
        res.status(httpStatus.OK);
        // Escape HTML content for security before rendering in <pre>
        const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        bodyContent = \`<h1>\${title}</h1><pre style="background:#eee; padding:10px; border-radius:5px; white-space:pre-wrap; word-wrap:break-word;">\${escapedContent}</pre>\`;
    }

     res.send(\`
      <!DOCTYPE html><html><head><title>\${title}</title>
      <style>body{font-family: sans-serif; padding: 20px; background: #f4f4f4;} a{text-decoration: none; color: #007bff;} a:hover{text-decoration: underline;} pre{max-height: 70vh; overflow-y: auto;}</style>
      </head><body>
        \${bodyContent}
        <br><a href="\${backLink}">Back to \${logType.charAt(0).toUpperCase() + logType.slice(1)} Logs</a>
      </body></html>
    \`);

};


// --- Controller Functions ---

export const getAllSuccessLogs = async (req: Request, res: Response) => {
  const successFiles = listLogFiles("successes");
  renderLogListPage(res, 'successes', successFiles);
};

export const getAllErrorLogs = async (req: Request, res: Response) => {
  const errorFiles = listLogFiles("errors");
  renderLogListPage(res, 'errors', errorFiles);
};

export const getSpecificSuccessLog = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const content = readLogFileContent("successes", filename);
    renderLogContentPage(res, 'successes', filename, content);
};

export const getSpecificErrorLog = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const content = readLogFileContent("errors", filename);
    renderLogContentPage(res, 'errors', filename, content);
};
`);

addFile(modulePath('Logs', 'logs.route.ts'), `
// src/app/modules/Logs/logs.route.ts
import express from 'express';
import * as logsController from './logs.controller.js'; // Use .js

const router = express.Router();

// These routes are typically mounted outside the main /api/v1 prefix in app.ts
router.get("/successes", logsController.getAllSuccessLogs);
router.get("/errors", logsController.getAllErrorLogs);
router.get("/successes/:filename", logsController.getSpecificSuccessLog);
router.get("/errors/:filename", logsController.getSpecificErrorLog);

export default router;
`);

// --- Add Constant Files ---
addFile('src/constants/pagination.ts', `
// src/constants/pagination.ts
export const paginationFields: string[] = ['page', 'limit', 'sortBy', 'sortOrder'];
`);

addFile('src/constants/userRoles.ts', `
// src/constants/userRoles.ts
// Define roles used in your application
// Matches the roles array in User.model.ts
export enum ENUM_USER_ROLE {
  USER = 'user',
  EXPERT = 'expert',
  ADMIN = 'admin',
  // Add other roles if needed
}

export const USER_ROLES_LIST = Object.values(ENUM_USER_ROLE);
`);

// --- HTML Templates (Example) ---
addFile('src/html/welcomeEmail.html',
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    ' <title>Welcome!</title>\n' +
    ' <style> body { font-family: sans-serif; } </style>\n' +
    '</head>\n' +
    '<body>\n' +
    // Use simple concatenation for the line with the dynamic placeholder
    ' <h1>Welcome to ${config.server_name || \'Our Service\'}, {{name}}!</h1>\n' + // Note the single quotes inside
    ' <p>Thank you for registering.</p>\n' +
    ' \n' +
    '</body>\n' +
    '</html>\n'
  );

// --- Views/Public Files (Placeholders - adapt from original script) ---
addFile('public/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>${projectName} Static Page</title>
 <link rel="stylesheet" href="/static/stylesheets/style.css"> </head>
<body>
 <h1>This is the static index page served at /static</h1>
 <p>This could be a landing page or placeholder.</p>
</body>
</html>
`);

addFile('public/stylesheets/style.css', `/* public/stylesheets/style.css */
body {
 font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 padding: 20px;
 background-color: #f8f9fa;
 color: #212529;
 line-height: 1.6;
}

h1 {
 color: #007bff;
}
`);

addFile('views/index.ejs', `<!DOCTYPE html>
<html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Welcome</title>
   <link rel="stylesheet" href="/static/stylesheets/style.css"> </head>
 <body>
   <h1>Welcome to the ${projectName} Backend!</h1>
   <p>This is a dynamic page rendered using EJS on the server.</p>
   <p>Current Server Time: <%= new Date().toLocaleTimeString() %></p>
   <p><a href="/">View Server Monitor</a></p>
   <p><a href="/api-docs">View API Docs (Swagger)</a></p>
 </body>
</html>
`);

addFile('views/error.ejs', `<!DOCTYPE html>
<html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Error</title>
   <link rel="stylesheet" href="/static/stylesheets/style.css">
   <style>
     .error-details { margin-top: 20px; background-color: #ffebee; border: 1px solid #e57373; padding: 15px; border-radius: 5px; }
     .error-stack { background-color: #f1f1f1; padding: 10px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 0.9em; margin-top: 15px; max-height: 400px; overflow-y: auto; }
     strong { color: #c62828; }
   </style>
 </head>
 <body>
   <h1>Oops! Something Went Wrong</h1>
    <div class="error-details">
        <% if (message) { %>
            <p><strong>Error Message:</strong> <%= message %></p>
        <% } else { %>
            <p>An unexpected error occurred. Please try again later.</p>
        <% } %>

        <%# Show stack trace and error object only in development environment %>
        <% if (env === 'development' && error) { %>
            <% if (error.statusCode) { %><p><strong>Status Code:</strong> <%= error.statusCode %></p><% } %>
            <% if (error.status) { %><p><strong>Status:</strong> <%= error.status %></p><% } %>
            <% if (error.isOperational !== undefined) { %><p><strong>Operational:</strong> <%= error.isOperational %></p><% } %>
            <% if (error.stack) { %>
                <h2>Developer Info (Stack Trace):</h2>
                <pre class="error-stack"><%= error.stack %></pre>
            <% } %>
             <h2>Full Error Object (Dev Only):</h2>
             <pre class="error-stack"><%= JSON.stringify(error, null, 2) %></pre>
        <% } %>
   </div>
   <p><a href="/">Go back to Home/Monitor</a></p>
 </body>
</html>
`);

// --- Deployment & CI/CD Files ---
addFile('Dockerfile', `
# Dockerfile for Node.js TypeScript Application

# --- Base Stage ---
# Use a specific Node.js LTS version (Alpine for smaller image size)
FROM node:18-alpine As base
WORKDIR /app

# --- Dependencies Stage ---
FROM base AS dependencies
# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* yarn.lock* ./
# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts
# If you have native dependencies needing build tools:
# RUN apk add --no-cache python3 make g++

# --- Build Stage ---
FROM base AS build
WORKDIR /app
# Copy dependency manifests
COPY package.json package-lock.json* yarn.lock* ./
# Install ALL dependencies (including devDependencies) needed for build
RUN npm ci --ignore-scripts
# Copy application source code
COPY . .
# Build TypeScript to JavaScript
RUN npm run build

# --- Production Stage ---
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
# Copy production dependencies from the 'dependencies' stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy built application code from the 'build' stage
COPY --from=build /app/dist ./dist
# Copy package.json (needed for running start script if it uses it)
COPY package.json .
# Copy assets like views and public if they are NOT built into dist
COPY views ./views
COPY public ./public
# Copy cert directory if using self-signed certs within the image (not recommended for prod)
# COPY cert ./cert

# Expose the port the app runs on (should match PORT in .env)
EXPOSE ${process.env.PORT || 3000}

# Command to run the application
CMD ["npm", "run", "start"]
# Or directly: CMD ["node", "dist/server.js"]

`);

addFile('docker-compose.yml', `
# docker-compose.yml
version: '3.8'

services:
  app:
    container_name: ${projectName || 'star-connect'}-app
    build:
      context: .
      dockerfile: Dockerfile
      # Optionally define build args for different stages if needed
      # target: production # Build only the production stage
    ports:
      # Map host port (left) to container port (right, from .env)
      - "\${PORT:-3000}:\${PORT:-3000}"
    env_file:
      - .env # Load environment variables from .env file
    volumes:
      # --- Development Volumes (Comment out/remove for production builds) ---
      # Mount source code for live reload (use if running dev server in container)
      # - ./src:/app/src
      # Mount logs for persistence/inspection on host
      - ./logs:/app/logs
      # Mount certs if managing them on the host
      # - ./cert:/app/cert
      # Named volume for node_modules to avoid overwriting container modules in dev
      # - node_modules:/app/node_modules
      # --- Production Volumes (Optional) ---
      # You might mount logs or persistent data dirs in production too
    # command: npm run dev # Use dev command for development override
    restart: unless-stopped # Restart policy for production
    networks:
      - app-network # Connect to a custom network

  # Optional: Add MongoDB service if running locally with Docker
  mongo:
    container_name: ${projectName || 'star-connect'}-mongo
    image: mongo:latest # Or specify a version like mongo:6.0
    ports:
      - "27017:27017" # Default MongoDB port
    volumes:
      - mongo-data:/data/db # Persist database data using a named volume
    environment:
      # Set root username/password if needed for MongoDB auth
      # MONGO_INITDB_ROOT_USERNAME: your_mongo_user
      # MONGO_INITDB_ROOT_PASSWORD: your_mongo_password
      MONGO_INITDB_DATABASE: ${projectName || 'starconnect'} # Automatically creates this DB
    networks:
      - app-network
    restart: unless-stopped

# Define custom network
networks:
  app-network:
    driver: bridge

# Define named volumes
volumes:
  mongo-data: # Volume for MongoDB data persistence
  # node_modules: # Named volume for development node_modules caching
`);

addFile('vercel.json', `
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js", // Entry point after running 'npm run build'
      "use": "@vercel/node",
      "config": {
         "includeFiles": [
           "dist/**",        // Include all compiled JS files
           "node_modules/**", // Include production dependencies
           "views/**",        // Include EJS templates if used by API
           "public/**",       // Include static assets if served by API
           "src/html/**"      // Include email templates
          // Exclude source maps or dev files if needed to reduce size:
          // "!dist/**/*.map"
          ],
         "maxLambdaSize": "50mb" // Adjust if needed
      }
    }
  ],
  "routes": [
    // Serve static files if needed (Vercel handles public dir automatically, but explicit rules can be used)
    // { "src": "/static/(.*)", "dest": "/public/$1" },

    // Redirect root or specific paths to backend or frontend if desired
    // { "src": "/", "dest": "/api/v1" }, // Example: Proxy root to API
    // { "src": "/home", "dest": "/dist/server.js" }, // If /home is handled by EJS

    // Main API route - rewrite all other requests to the serverless function
    {
      "src": "/(.*)", // Matches everything
      "dest": "dist/server.js" // Route to the built server file
    }
  ],
  "env": {
     // You can define Vercel environment variables here
     // but it's highly recommended to use the Vercel dashboard
     // for secrets like MONGODB_URI, JWT_SECRET, API Keys etc.
     // Example:
     // "NODE_ENV": "production"
  },
   "github": {
     "silent": true // Suppress automatic comments on PRs
  }
}
`);

addFile('.github/workflows/node.yml', `
# .github/workflows/node.yml
# Basic GitHub Actions workflow for Node.js CI

name: Node.js CI

on:
  push:
    branches: [ "main", "master", "develop" ] # Trigger on pushes to these branches
  pull_request:
    branches: [ "main", "master", "develop" ] # Trigger on pull requests to these branches

jobs:
  build_and_test:
    runs-on: ubuntu-latest # Use the latest Ubuntu runner

    strategy:
      matrix:
        node-version: [18.x, 20.x] # Test against multiple Node.js versions (LTS recommended)

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4 # Use latest version

    - name: Set up Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm' # Enable caching for npm dependencies

    - name: Install dependencies
      run: npm ci # Use ci for faster, reliable installs in CI

    - name: Build TypeScript
      run: npm run build --if-present # Run build script if it exists

    - name: Run linters
      run: npm run lint --if-present # Run lint script if it exists

    - name: Run Prettier check
      run: npm run prettier --if-present # Run prettier check if it exists

    - name: Run tests (if configured)
      run: npm test --if-present # Run test script if it exists
      # env: # Pass environment variables needed for tests (use GitHub secrets for sensitive data)
      #   CI: true
      #   MONGODB_URI: \${{ secrets.TEST_MONGODB_URI }}
      #   JWT_SECRET: \${{ secrets.TEST_JWT_SECRET }}

    # --- Optional: Deployment Step (Example for Vercel) ---
    # - name: Deploy to Vercel (only on main branch push)
    #   if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    #   uses: amondnet/vercel-action@v25 # Or official Vercel action
    #   with:
    #     vercel-token: \${{ secrets.VERCEL_TOKEN }} # Required
    #     vercel-org-id: \${{ secrets.VERCEL_ORG_ID }} # Required
    #     vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }} # Required
    #     vercel-args: '--prod' # Deploy to production

`);

addFile('README.md', `
# ${projectName || 'Star Connect Backend TS (Modular)'}

A Node.js backend with JWT authentication, built with TypeScript, Express, and MongoDB, following a modular monolithic architecture. Includes LiveKit integration and SSLCommerz payment handling placeholders.

## Features

* **Modular Architecture:** Code organized by feature modules (Auth, User, Expert, Booking, Payment, etc.).
* **TypeScript:** Strongly typed codebase.
* **Authentication:** JWT-based login/registration (Bearer Token). Role-based access control middleware included.
* **Database:** MongoDB with Mongoose ODM. Models based on Star Connect requirements.
* **LiveKit Integration:** Service and controller for generating LiveKit client tokens.
* **Payment Integration:** Placeholders for SSLCommerz payment initiation and IPN handling.
* **Error Handling:** Centralized global error handler and custom \\\`AppError\\\` class.
* **Validation:** Placeholder structure for input validation using Zod within modules.
* **Logging:** Winston setup for file and console logging (environment-aware).
* **API Documentation:** Swagger (OpenAPI) setup for interactive API docs at \`/api-docs\`.
* **Security:** Basic security with Helmet, CORS configuration, rate limiting.
* **Development:** Configured with ESLint, Prettier, and \`ts-node-dev\` for hot-reloading.
* **Deployment:** Includes \`Dockerfile\`, \`docker-compose.yml\`, \`vercel.json\`, and a basic GitHub Actions CI workflow (\`.github/workflows/node.yml\`).
* **Server Monitoring:** Basic monitor page at the root (\`/\`) showing system info, usage, and log links.
* **View Engine:** EJS setup for potential server-rendered pages (e.g., error page, basic home).

## Project Structure

\`\`\`
.
├── cert/                 # SSL certificates (optional)
├── dist/                 # Compiled JavaScript output
├── logs/                 # Application logs (Winston)
├── public/               # Static assets (CSS, JS, images)
├── src/
│   ├── app/
│   │   ├── middlewares/  # Express middleware (auth, error, validation, logger)
│   │   ├── modules/      # Feature modules (Auth, User, Booking, etc.)
│   │   │   └── ExampleModule/
│   │   │       ├── example.controller.ts
│   │   │       ├── example.interface.ts
│   │   │       ├── example.model.ts
│   │   │       ├── example.route.ts
│   │   │       ├── example.service.ts
│   │   │       └── example.validation.ts
│   │   └── routes/       # Main API router (index.ts aggregates module routes)
│   ├── config/           # Environment configuration loader (index.ts)
│   ├── constants/        # Application constants (pagination, roles)
│   ├── errors/           # Custom error handling utilities
│   ├── helpers/          # Helper functions (jwt, pagination, email, logs)
│   ├── html/             # HTML templates (e.g., for emails)
│   ├── interfaces/       # Shared TypeScript interfaces/types (common, error, index.d.ts)
│   ├── shared/           # Shared utilities (catchAsync, logger, pick, sendResponse)
│   ├── utils/            # General utilities (AppError, fileUtils, serverMonitor, swagger)
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server entry point (connects DB, starts server)
├── views/                # EJS templates
├── .env                  # Environment variables (GITIGNORED!)
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── Dockerfile            # Docker build instructions
├── docker-compose.yml    # Docker Compose setup (includes optional MongoDB)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript compiler options
└── vercel.json           # Vercel deployment configuration
\`\`\`

## Getting Started

1.  **Clone:** \`git clone <repository-url>\`
2.  **Install Dependencies:** \`npm install\`
3.  **Environment Variables:**
    * Copy \`.env.example\` (if provided) or create \`.env\` based on the example in \`createStructure_modular.js\` or the one generated by it.
    * Fill in **all required** variables (MONGODB\_URI, JWT\_SECRET, JWT\_REFRESH\_SECRET, LIVEKIT\_API\_KEY, LIVEKIT\_API\_SECRET, SSLCOMMERZ\_STORE\_ID, SSLCOMMERZ\_STORE\_PASSWORD, etc.).
4.  **Development:** \`npm run dev\` (Uses \`ts-node-dev\` for auto-reloading)
5.  **Build:** \`npm run build\` (Compiles TypeScript to \`./dist\`)
6.  **Production:** \`npm start\` (Runs the compiled code from \`./dist\`)
7.  **HTTPS (Optional):** Place \`server.cert\` and \`server.key\` in the \`cert/\` directory and set \`HTTPS=true\` in your \`.env\` file.
8.  **Docker:** Use \`docker-compose up --build\` to build and run the app and a MongoDB container.

## API Documentation

Once the server is running, access the Swagger UI documentation at [http://localhost:PORT/api-docs](http://localhost:PORT/api-docs) (replace PORT with the actual port number).

`);

// --- Final Execution: Write files ---
console.log('\nCreating project files...');
let createdCount = 0;
let skippedCount = 0;
let errorCount = 0;

sampleFiles.forEach((item) => {
    const filePath = path.join(projectRootDir, item.filePath);
    const dirName = path.dirname(filePath);

    try {
        // Ensure parent directory exists
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
            // console.log(`  Created parent directory for: ${item.filePath}`);
        }

        // Write file only if it doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, item.content, 'utf8');
            // console.log(`  Created file: ${item.filePath}`);
            createdCount++;
        } else {
            // console.log(`  File already exists: ${item.filePath} (Skipped)`);
            skippedCount++;
        }
    } catch (err) {
        console.error(`  Error creating file ${item.filePath}:`.red, err);
        errorCount++;
    }
});

console.log('\n----------------------------------------------------'); // Removed .cyan
console.log(`File Creation Summary:`); // Removed .bold
console.log(`  Created: ${createdCount}`); // Removed .green
console.log(`  Skipped (Already Existed): ${skippedCount}`); // Removed .yellow
if (errorCount > 0) {
    console.log(`  Errors: ${errorCount}`); // Removed .red.bold
}
console.log(`\nProject structure '${projectName}' generated successfully.`); // Removed .cyan.bold
console.log("----------------------------------------------------"); // Removed .cyan
console.log("Next Steps:"); // Removed .bold
console.log("1. Run 'npm install' to install dependencies.");
console.log("2. Update the '.env' file with your actual credentials.");
console.log("3. Review and implement logic in services, controllers, routes, and validation files within 'src/app/modules/'.");
console.log("4. If using HTTPS, place 'server.cert' and 'server.key' in the 'cert/' directory and set HTTPS=true in .env.");
console.log("5. Run 'npm run dev' for development.");
console.log("6. Run 'npm run build' then 'npm start' for production mode.");
console.log("7. Explore Docker with 'docker-compose up --build'.");
console.log("----------------------------------------------------"); // Removed .cyan