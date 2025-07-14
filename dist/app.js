"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const games_1 = __importDefault(require("./routes/games"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// More strict rate limiting for auth endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 auth requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes
app.use('/auth', authLimiter, auth_1.default);
app.use('/games', games_1.default);
app.use('/leaderboard', leaderboard_1.default);
// API documentation endpoint (basic info)
app.get('/api', (req, res) => {
    res.status(200).json({
        name: 'Time It Right Game API',
        version: '1.0.0',
        description: 'A game timer system where users try to stop a timer exactly at 10 seconds',
        endpoints: {
            auth: {
                'POST /auth/register': 'Register a new user',
                'POST /auth/login': 'Login existing user',
                'POST /auth/refresh': 'Refresh user token',
                'GET /auth/me': 'Get current user info (requires auth)',
                'POST /auth/logout': 'Logout user (requires auth)'
            },
            games: {
                'POST /games/:userId/start': 'Start a new game session (requires auth)',
                'POST /games/:userId/stop': 'Stop a game session (requires auth)',
                'GET /games/:userId/stats': 'Get user statistics (requires auth)',
                'GET /games/:userId/active': 'Get active session (requires auth)',
                'POST /games/cleanup': 'Cleanup expired sessions (requires auth)'
            },
            leaderboard: {
                'GET /leaderboard': 'Get top leaderboard entries',
                'GET /leaderboard/stats': 'Get leaderboard statistics',
                'GET /leaderboard/top-performers': 'Get top performers by different metrics',
                'GET /leaderboard/user/:userId': 'Get user position in leaderboard',
                'GET /leaderboard/user/:userId/around': 'Get leaderboard around user',
                'GET /leaderboard/user/:userId/percentile': 'Get user percentile rank'
            }
        },
        gameRules: {
            target: '10 seconds (10,000 milliseconds)',
            sessionTimeout: '30 minutes',
            scoring: 'Lower average deviation from 10 seconds is better'
        }
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error.message
        })
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map