"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Start the server
const server = app_1.default.listen(PORT, () => {
    console.log(`
🚀 Time It Right Game API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${NODE_ENV}
🌐 Server URL: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}/api
❤️  Health Check: http://localhost:${PORT}/health

Game Rules:
🎯 Target: Try to stop the timer exactly at 10 seconds
⏱️  Session Timeout: 30 minutes
🏆 Scoring: Lower average deviation from 10 seconds is better

Main Endpoints:
• POST /auth/register - Register new user
• POST /auth/login - Login user
• POST /games/{userId}/start - Start game session
• POST /games/{userId}/stop - Stop game session
• GET /leaderboard - Get top 10 leaderboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n📴 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('\n📴 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    server.close(() => {
        console.log('✅ Server closed due to unhandled promise rejection');
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    console.log('✅ Server shutting down due to uncaught exception');
    process.exit(1);
});
exports.default = server;
//# sourceMappingURL=index.js.map