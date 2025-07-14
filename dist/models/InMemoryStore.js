"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryStore = void 0;
const utils_1 = require("../utils");
/**
 * In-memory database store for the Time It Right game
 * This would be replaced with Redis or a proper database in production
 */
class InMemoryStore {
    constructor() {
        this.users = new Map();
        this.usersByUsername = new Map();
        this.gameSessions = new Map();
        this.userSessions = new Map(); // userId -> sessionIds[]
    }
    // User operations
    createUser(username, passwordHash) {
        const user = {
            id: (0, utils_1.generateId)(),
            username,
            passwordHash,
            createdAt: new Date()
        };
        this.users.set(user.id, user);
        this.usersByUsername.set(username, user);
        return user;
    }
    getUserById(id) {
        return this.users.get(id);
    }
    getUserByUsername(username) {
        return this.usersByUsername.get(username);
    }
    getAllUsers() {
        return Array.from(this.users.values());
    }
    // Game session operations
    createGameSession(userId, startTime) {
        const session = {
            id: (0, utils_1.generateId)(),
            userId,
            startTime,
            isCompleted: false,
            createdAt: new Date()
        };
        this.gameSessions.set(session.id, session);
        // Track sessions by user
        const userSessionIds = this.userSessions.get(userId) || [];
        userSessionIds.push(session.id);
        this.userSessions.set(userId, userSessionIds);
        return session;
    }
    getGameSessionById(id) {
        return this.gameSessions.get(id);
    }
    updateGameSession(id, updates) {
        const session = this.gameSessions.get(id);
        if (!session)
            return undefined;
        const updatedSession = { ...session, ...updates };
        this.gameSessions.set(id, updatedSession);
        return updatedSession;
    }
    getUserSessions(userId) {
        const sessionIds = this.userSessions.get(userId) || [];
        return sessionIds
            .map(id => this.gameSessions.get(id))
            .filter(session => session !== undefined);
    }
    getCompletedUserSessions(userId) {
        return this.getUserSessions(userId).filter(session => session.isCompleted);
    }
    // Leaderboard operations
    generateLeaderboard(limit = 10) {
        const leaderboard = [];
        for (const user of this.users.values()) {
            const completedSessions = this.getCompletedUserSessions(user.id);
            if (completedSessions.length === 0)
                continue;
            const deviations = completedSessions
                .map(session => session.deviation)
                .filter(deviation => !isNaN(deviation));
            if (deviations.length === 0)
                continue;
            const averageDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
            const bestDeviation = Math.min(...deviations);
            leaderboard.push({
                userId: user.id,
                username: user.username,
                totalGames: completedSessions.length,
                averageDeviation: Math.round(averageDeviation * 100) / 100, // Round to 2 decimal places
                bestDeviation: Math.round(bestDeviation * 100) / 100
            });
        }
        // Sort by average deviation (ascending - lower is better)
        leaderboard.sort((a, b) => a.averageDeviation - b.averageDeviation);
        return leaderboard.slice(0, limit);
    }
    // Analytics and stats
    getTotalUsers() {
        return this.users.size;
    }
    getTotalSessions() {
        return this.gameSessions.size;
    }
    getTotalCompletedSessions() {
        return Array.from(this.gameSessions.values()).filter(session => session.isCompleted).length;
    }
    // Cleanup operations (useful for testing)
    clearAllData() {
        this.users.clear();
        this.usersByUsername.clear();
        this.gameSessions.clear();
        this.userSessions.clear();
    }
    // Get active (non-completed) sessions for a user
    getActiveUserSessions(userId) {
        return this.getUserSessions(userId).filter(session => !session.isCompleted);
    }
}
// Export singleton instance
exports.inMemoryStore = new InMemoryStore();
exports.default = exports.inMemoryStore;
//# sourceMappingURL=InMemoryStore.js.map