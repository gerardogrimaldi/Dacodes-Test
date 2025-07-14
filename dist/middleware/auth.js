"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserAccess = exports.optionalAuth = exports.authenticateToken = void 0;
const AuthService_1 = require("../services/AuthService");
/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                error: 'Access denied. No token provided.'
            });
            return;
        }
        // Verify token
        const payload = AuthService_1.authService.verifyToken(token);
        // Get user from database
        const user = AuthService_1.authService.getUserFromToken(token);
        if (!user) {
            res.status(401).json({
                error: 'Access denied. Invalid token.'
            });
            return;
        }
        // Attach user to request object
        req.user = {
            id: user.id,
            username: user.username
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Access denied. Invalid token.'
        });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware to extract user from token if present (optional auth)
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const user = AuthService_1.authService.getUserFromToken(token);
            if (user) {
                req.user = {
                    id: user.id,
                    username: user.username
                };
            }
        }
        next();
    }
    catch (error) {
        // If token is invalid, continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Middleware to validate user ID parameter matches authenticated user
 */
const validateUserAccess = (req, res, next) => {
    const { userId } = req.params;
    if (!req.user) {
        res.status(401).json({
            error: 'Access denied. Authentication required.'
        });
        return;
    }
    if (req.user.id !== userId) {
        res.status(403).json({
            error: 'Access denied. You can only access your own resources.'
        });
        return;
    }
    next();
};
exports.validateUserAccess = validateUserAccess;
//# sourceMappingURL=auth.js.map