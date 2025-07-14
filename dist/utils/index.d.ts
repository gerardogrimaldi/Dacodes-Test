/**
 * Generate a unique ID using crypto.randomBytes
 */
export declare const generateId: () => string;
/**
 * Get current timestamp in milliseconds
 */
export declare const getCurrentTimestamp: () => number;
/**
 * Calculate deviation from target duration
 */
export declare const calculateDeviation: (actualDuration: number, targetDuration: number) => number;
/**
 * Check if a session has expired
 */
export declare const isSessionExpired: (startTime: number, timeoutMs: number) => boolean;
/**
 * Format time in milliseconds to a readable string
 */
export declare const formatTime: (ms: number) => string;
/**
 * Validate username format
 */
export declare const isValidUsername: (username: string) => boolean;
/**
 * Validate password strength
 */
export declare const isValidPassword: (password: string) => boolean;
/**
 * Calculate average from array of numbers
 */
export declare const calculateAverage: (numbers: number[]) => number;
/**
 * Get minimum value from array of numbers
 */
export declare const getMinimum: (numbers: number[]) => number;
//# sourceMappingURL=index.d.ts.map