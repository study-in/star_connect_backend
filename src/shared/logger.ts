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
  const logMessage = stack ? `${message}
Stack: ${stack}` : message;
  return `${logTimestamp} [${logLabel}] ${level}: ${logMessage}`;
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
