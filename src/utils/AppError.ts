// src/utils/AppError.ts
// Custom error class for operational errors (errors we expect and handle)
class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        // Status depends on statusCode (4xx = fail, 5xx = error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // All instances of AppError are operational errors
        this.isOperational = true;

        // Capture stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
