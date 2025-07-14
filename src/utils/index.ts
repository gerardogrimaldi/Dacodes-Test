import { randomBytes } from 'crypto';

/**
 * Generate a unique ID using crypto.randomBytes
 */
export const generateId = (): string => {
  return randomBytes(16).toString('hex');
};

/**
 * Get current timestamp in milliseconds
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Calculate deviation from target duration
 */
export const calculateDeviation = (actualDuration: number, targetDuration: number): number => {
  return Math.abs(actualDuration - targetDuration);
};

/**
 * Check if a session has expired
 */
export const isSessionExpired = (startTime: number, timeoutMs: number): boolean => {
  return (Date.now() - startTime) > timeoutMs;
};

/**
 * Format time in milliseconds to a readable string
 */
export const formatTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Calculate average from array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

/**
 * Get minimum value from array of numbers
 */
export const getMinimum = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
}; 