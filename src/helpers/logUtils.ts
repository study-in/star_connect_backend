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
        console.warn(`Log directory not found: ${logDir}`.yellow);
        return [];
    }
    // Read directory and filter for .log files
    return fs.readdirSync(logDir).filter((file) => file.endsWith('.log')).sort().reverse(); // Sort descending (newest first)
  } catch (err) {
    console.error(`Failed to list ${logType} logs from ${logDir}:`.red, err);
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
        console.error(`Attempted path traversal in log filename: ${filename}`.red);
        return null;
    }

    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            console.warn(`Log file not found: ${filePath}`.yellow);
            return null;
        }
    } catch (err) {
        console.error(`Failed to read log file ${filePath}:`.red, err);
        return null;
    }
};
