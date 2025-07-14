"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardService = void 0;
const InMemoryStore_1 = require("../models/InMemoryStore");
class LeaderboardService {
    /**
     * Get the top leaderboard entries
     */
    async getLeaderboard(limit = 10) {
        const leaderboard = InMemoryStore_1.inMemoryStore.generateLeaderboard(limit);
        return {
            leaderboard,
            totalEntries: leaderboard.length
        };
    }
    /**
     * Get user's position in leaderboard
     */
    async getUserPosition(userId) {
        const fullLeaderboard = InMemoryStore_1.inMemoryStore.generateLeaderboard(1000); // Get all users
        const userIndex = fullLeaderboard.findIndex(entry => entry.userId === userId);
        if (userIndex === -1) {
            return {
                position: 0,
                entry: null,
                totalUsers: fullLeaderboard.length
            };
        }
        return {
            position: userIndex + 1,
            entry: fullLeaderboard[userIndex],
            totalUsers: fullLeaderboard.length
        };
    }
    /**
     * Get leaderboard around a specific user
     */
    async getLeaderboardAroundUser(userId, range = 5) {
        const fullLeaderboard = InMemoryStore_1.inMemoryStore.generateLeaderboard(1000);
        const userIndex = fullLeaderboard.findIndex(entry => entry.userId === userId);
        if (userIndex === -1) {
            return {
                leaderboard: [],
                userPosition: 0,
                totalUsers: fullLeaderboard.length
            };
        }
        // Get entries around the user
        const startIndex = Math.max(0, userIndex - range);
        const endIndex = Math.min(fullLeaderboard.length, userIndex + range + 1);
        const surroundingEntries = fullLeaderboard.slice(startIndex, endIndex);
        return {
            leaderboard: surroundingEntries,
            userPosition: userIndex + 1,
            totalUsers: fullLeaderboard.length
        };
    }
    /**
     * Get leaderboard statistics
     */
    async getLeaderboardStats() {
        const allUsers = InMemoryStore_1.inMemoryStore.getAllUsers();
        const leaderboard = InMemoryStore_1.inMemoryStore.generateLeaderboard(1000);
        if (leaderboard.length === 0) {
            return {
                totalUsers: allUsers.length,
                totalGames: 0,
                averageDeviation: 0,
                bestOverallDeviation: 0,
                mostActiveUser: null
            };
        }
        const totalGames = leaderboard.reduce((sum, entry) => sum + entry.totalGames, 0);
        const overallAverageDeviation = leaderboard.reduce((sum, entry) => sum + entry.averageDeviation, 0) / leaderboard.length;
        const bestOverallDeviation = Math.min(...leaderboard.map(entry => entry.bestDeviation));
        // Find most active user
        const mostActiveEntry = leaderboard.reduce((prev, current) => prev.totalGames > current.totalGames ? prev : current);
        return {
            totalUsers: allUsers.length,
            totalGames,
            averageDeviation: Math.round(overallAverageDeviation * 100) / 100,
            bestOverallDeviation: Math.round(bestOverallDeviation * 100) / 100,
            mostActiveUser: {
                username: mostActiveEntry.username,
                gameCount: mostActiveEntry.totalGames
            }
        };
    }
    /**
     * Get top performers by different metrics
     */
    async getTopPerformers() {
        const allEntries = InMemoryStore_1.inMemoryStore.generateLeaderboard(1000);
        // Top by average deviation (already sorted)
        const topByAverage = allEntries.slice(0, 10);
        // Top by best deviation
        const topByBest = [...allEntries]
            .sort((a, b) => a.bestDeviation - b.bestDeviation)
            .slice(0, 10);
        // Top by number of games
        const topByGames = [...allEntries]
            .sort((a, b) => b.totalGames - a.totalGames)
            .slice(0, 10);
        return {
            topByAverage,
            topByBest,
            topByGames
        };
    }
    /**
     * Calculate percentile rank for a user
     */
    async getUserPercentile(userId) {
        const fullLeaderboard = InMemoryStore_1.inMemoryStore.generateLeaderboard(1000);
        const userIndex = fullLeaderboard.findIndex(entry => entry.userId === userId);
        if (userIndex === -1 || fullLeaderboard.length === 0) {
            return 0;
        }
        // Calculate percentile (lower is better for deviation)
        const percentile = ((fullLeaderboard.length - userIndex) / fullLeaderboard.length) * 100;
        return Math.round(percentile * 100) / 100;
    }
}
exports.leaderboardService = new LeaderboardService();
exports.default = exports.leaderboardService;
//# sourceMappingURL=LeaderboardService.js.map