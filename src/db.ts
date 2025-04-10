// src/db.ts - Mongoose Connection Setup
import mongoose from 'mongoose';
import config from './config/index.js'; // Use .js extension
import { logger, errorLogger } from './shared/logger.js'; // Use .js extension

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true); // Recommended practice for Mongoose 7+

    await mongoose.connect(config.database_url, {
        dbName: `${config.server_name}-db`,
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
