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
          success_url: `${process.env.BACKEND_URL}/api/v1/payments/success`, // Route might need transactionId param
          fail_url: `${process.env.BACKEND_URL}/api/v1/payments/fail`,
          cancel_url: `${process.env.BACKEND_URL}/api/v1/payments/cancel`,
          ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/notify/sslcommerz`,
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
  backend_url: process.env.BACKEND_URL || `http://localhost:${parseInt(process.env.PORT || '3001', 10)}`

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
