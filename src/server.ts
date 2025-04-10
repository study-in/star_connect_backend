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
  const message = `🚨 Uncaught Exception! Shutting down...
${error.name}: ${error.message}`;
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
      dbName: `${config.server_name}-db`,
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
      const message = `🚀 Server (${serverType}) running on port ${config.port} [${config.env}]`; // Now use serverType      if (config.env === 'production') {
        logger.info(message);
      } else {
        console.log(message.cyan.bold.underline);
      }
    });

  } catch (err: any) {
     const message = `❌ Server startup error on port ${config.port}`;
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
  console.log(`
👋 ${signal} signal received. Shutting down gracefully...`.yellow);
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
    const message = `🚨 Unhandled Rejection! Shutting down...
${reason?.name || 'Error'}: ${reason?.message || reason}`;
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
