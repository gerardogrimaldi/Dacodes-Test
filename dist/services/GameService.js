"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameService = void 0;
const types_1 = require("../types");
const InMemoryStore_1 = require("../models/InMemoryStore");
const utils_1 = require("../utils");
class GameService {
    /**
     * Start a new game session for a user
     */
    async startGame(userId) {
        // Check if user exists
        const user = InMemoryStore_1.inMemoryStore.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check for existing active sessions and clean them up
        const activeSessions = InMemoryStore_1.inMemoryStore.getActiveUserSessions(userId);
        for (const session of activeSessions) {
            // Auto-complete expired sessions
            if ((0, utils_1.isSessionExpired)(session.startTime, types_1.SESSION_TIMEOUT)) {
                InMemoryStore_1.inMemoryStore.updateGameSession(session.id, {
                    isCompleted: true,
                    endTime: session.startTime + types_1.SESSION_TIMEOUT,
                    deviation: types_1.SESSION_TIMEOUT // Mark as timeout
                });
            }
        }
        // Create new game session
        const startTime = (0, utils_1.getCurrentTimestamp)();
        const newSession = InMemoryStore_1.inMemoryStore.createGameSession(userId, startTime);
        return {
            sessionId: newSession.id,
            message: 'Game session started! Try to stop the timer exactly at 10 seconds.',
            startTime: startTime
        };
    }
    /**
     * Stop a game session and calculate results
     */
    async stopGame(userId, sessionId) {
        // Check if user exists
        const user = InMemoryStore_1.inMemoryStore.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        let session;
        if (sessionId) {
            // Stop specific session
            session = InMemoryStore_1.inMemoryStore.getGameSessionById(sessionId);
            if (!session) {
                throw new Error('Game session not found');
            }
            if (session.userId !== userId) {
                throw new Error('Unauthorized: Session does not belong to user');
            }
        }
        else {
            // Stop the most recent active session
            const activeSessions = InMemoryStore_1.inMemoryStore.getActiveUserSessions(userId);
            if (activeSessions.length === 0) {
                throw new Error('No active game session found. Please start a game first.');
            }
            // Get the most recent session
            session = activeSessions.sort((a, b) => b.startTime - a.startTime)[0];
        }
        // Check if session is already completed
        if (session.isCompleted) {
            throw new Error('Game session already completed');
        }
        // Check if session has expired
        if ((0, utils_1.isSessionExpired)(session.startTime, types_1.SESSION_TIMEOUT)) {
            // Auto-complete expired session
            InMemoryStore_1.inMemoryStore.updateGameSession(session.id, {
                isCompleted: true,
                endTime: session.startTime + types_1.SESSION_TIMEOUT,
                deviation: types_1.SESSION_TIMEOUT
            });
            throw new Error('Game session expired. Please start a new game.');
        }
        // Calculate game results
        const endTime = (0, utils_1.getCurrentTimestamp)();
        const actualDuration = endTime - session.startTime;
        const deviation = (0, utils_1.calculateDeviation)(actualDuration, types_1.TARGET_DURATION);
        // Update session with results
        const updatedSession = InMemoryStore_1.inMemoryStore.updateGameSession(session.id, {
            endTime,
            deviation,
            isCompleted: true
        });
        if (!updatedSession) {
            throw new Error('Failed to update game session');
        }
        // Generate response message based on performance
        let message;
        if (deviation <= 50) {
            message = 'Excellent! Perfect timing!';
        }
        else if (deviation <= 200) {
            message = 'Great job! Very close to the target.';
        }
        else if (deviation <= 500) {
            message = 'Good effort! Try to get closer to 10 seconds.';
        }
        else if (deviation <= 1000) {
            message = 'Not bad! Keep practicing to improve your timing.';
        }
        else {
            message = 'Keep trying! Focus on counting to 10 seconds.';
        }
        return {
            sessionId: session.id,
            startTime: session.startTime,
            endTime,
            actualDuration,
            targetDuration: types_1.TARGET_DURATION,
            deviation,
            message
        };
    }
    /**
     * Get user's game statistics
     */
    async getUserStats(userId) {
        const user = InMemoryStore_1.inMemoryStore.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const allSessions = InMemoryStore_1.inMemoryStore.getUserSessions(userId);
        const completedSessions = allSessions.filter(session => session.isCompleted);
        const deviations = completedSessions
            .map(session => session.deviation)
            .filter(deviation => !isNaN(deviation) && deviation < types_1.SESSION_TIMEOUT);
        const averageDeviation = deviations.length > 0
            ? deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length
            : 0;
        const bestDeviation = deviations.length > 0 ? Math.min(...deviations) : 0;
        return {
            totalGames: allSessions.length,
            completedGames: completedSessions.length,
            averageDeviation: Math.round(averageDeviation * 100) / 100,
            bestDeviation: Math.round(bestDeviation * 100) / 100,
            recentSessions: allSessions.slice(-10).reverse() // Last 10 sessions, most recent first
        };
    }
    /**
     * Get active session for a user
     */
    async getActiveSession(userId) {
        const user = InMemoryStore_1.inMemoryStore.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const activeSessions = InMemoryStore_1.inMemoryStore.getActiveUserSessions(userId);
        if (activeSessions.length === 0) {
            return null;
        }
        // Return the most recent active session
        return activeSessions.sort((a, b) => b.startTime - a.startTime)[0];
    }
    /**
     * Clean up expired sessions (utility method)
     */
    async cleanupExpiredSessions() {
        const allSessions = Array.from(InMemoryStore_1.inMemoryStore['gameSessions'].values());
        let cleanedCount = 0;
        for (const session of allSessions) {
            if (!session.isCompleted && (0, utils_1.isSessionExpired)(session.startTime, types_1.SESSION_TIMEOUT)) {
                InMemoryStore_1.inMemoryStore.updateGameSession(session.id, {
                    isCompleted: true,
                    endTime: session.startTime + types_1.SESSION_TIMEOUT,
                    deviation: types_1.SESSION_TIMEOUT
                });
                cleanedCount++;
            }
        }
        return cleanedCount;
    }
}
exports.gameService = new GameService();
exports.default = exports.gameService;
//# sourceMappingURL=GameService.js.map