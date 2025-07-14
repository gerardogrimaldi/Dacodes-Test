"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    /**
     * Register a new user
     * POST /auth/register
     */
    async register(req, res) {
        try {
            const { username, password } = req.body;
            // Validate input
            if (!username || !password) {
                res.status(400).json({
                    error: 'Username and password are required'
                });
                return;
            }
            // Register user
            const authResponse = await AuthService_1.authService.register({ username, password });
            res.status(201).json({
                message: 'User registered successfully',
                data: authResponse
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            const statusCode = message.includes('already exists') ? 409 : 400;
            res.status(statusCode).json({
                error: message
            });
        }
    }
    /**
     * Login existing user
     * POST /auth/login
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;
            // Validate input
            if (!username || !password) {
                res.status(400).json({
                    error: 'Username and password are required'
                });
                return;
            }
            // Login user
            const authResponse = await AuthService_1.authService.login({ username, password });
            res.status(200).json({
                message: 'Login successful',
                data: authResponse
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            const statusCode = message.includes('Invalid credentials') ? 401 : 400;
            res.status(statusCode).json({
                error: message
            });
        }
    }
    /**
     * Refresh user token
     * POST /auth/refresh
     */
    async refreshToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                res.status(401).json({
                    error: 'No token provided'
                });
                return;
            }
            const newToken = AuthService_1.authService.refreshToken(token);
            res.status(200).json({
                message: 'Token refreshed successfully',
                data: {
                    token: newToken
                }
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Token refresh failed';
            res.status(401).json({
                error: message
            });
        }
    }
    /**
     * Get current user info
     * GET /auth/me
     */
    async getMe(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Authentication required'
                });
                return;
            }
            res.status(200).json({
                message: 'User information retrieved successfully',
                data: {
                    user: req.user
                }
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get user info';
            res.status(500).json({
                error: message
            });
        }
    }
    /**
     * Logout user (client should discard token)
     * POST /auth/logout
     */
    async logout(req, res) {
        try {
            // Since JWTs are stateless, we just send a success message
            // In a production app, you might want to maintain a blacklist of tokens
            res.status(200).json({
                message: 'Logged out successfully. Please discard your token on the client side.'
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Logout failed';
            res.status(500).json({
                error: message
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
exports.default = exports.authController;
//# sourceMappingURL=AuthController.js.map