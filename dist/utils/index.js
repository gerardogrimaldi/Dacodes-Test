"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinimum = exports.calculateAverage = exports.isValidPassword = exports.isValidUsername = exports.formatTime = exports.isSessionExpired = exports.calculateDeviation = exports.getCurrentTimestamp = exports.generateId = void 0;
const crypto_1 = require("crypto");
/**
 * Generate a unique ID using crypto.randomBytes
 */
const generateId = () => {
    return (0, crypto_1.randomBytes)(16).toString('hex');
};
exports.generateId = generateId;
/**
 * Get current timestamp in milliseconds
 */
const getCurrentTimestamp = () => {
    return Date.now();
};
exports.getCurrentTimestamp = getCurrentTimestamp;
/**
 * Calculate deviation from target duration
 */
const calculateDeviation = (actualDuration, targetDuration) => {
    return Math.abs(actualDuration - targetDuration);
};
exports.calculateDeviation = calculateDeviation;
/**
 * Check if a session has expired
 */
const isSessionExpired = (startTime, timeoutMs) => {
    return (Date.now() - startTime) > timeoutMs;
};
exports.isSessionExpired = isSessionExpired;
/**
 * Format time in milliseconds to a readable string
 */
const formatTime = (ms) => {
    if (ms < 1000) {
        return `${ms}ms`;
    }
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
};
exports.formatTime = formatTime;
/**
 * Validate username format
 */
const isValidUsername = (username) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
exports.isValidUsername = isValidUsername;
/**
 * Validate password strength
 */
const isValidPassword = (password) => {
    return password.length >= 6;
};
exports.isValidPassword = isValidPassword;
/**
 * Calculate average from array of numbers
 */
const calculateAverage = (numbers) => {
    if (numbers.length === 0)
        return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};
exports.calculateAverage = calculateAverage;
/**
 * Get minimum value from array of numbers
 */
const getMinimum = (numbers) => {
    if (numbers.length === 0)
        return 0;
    return Math.min(...numbers);
};
exports.getMinimum = getMinimum;
//# sourceMappingURL=index.js.map