// src/helpers/formatDate.ts
/**
 * Formats a Date object into a simple string (e.g., "Thu Apr 03 2025").
 * @param date The Date object to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid Date";
  }
  return date.toDateString(); // Simple formatting, adjust using libraries like date-fns or moment if needed
};
