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
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Mark this error as operational (expected, not a bug)
    this.isOperational = true;

    // Capture the stack trace correctly, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
