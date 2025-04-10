// src/interfaces/error.ts

// Structure for individual error messages within an error response
export interface IGenericErrorMessage {
  path: string | number; // Field name or index causing the error
  message: string;      // Description of the error
}
