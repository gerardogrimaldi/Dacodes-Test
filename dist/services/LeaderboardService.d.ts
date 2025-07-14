import { LeaderboardEntry, LeaderboardResponse } from '../types';
declare class LeaderboardService {
    /**
     * Get the top leaderboard entries
     */
    getLeaderboard(limit?: number): Promise<LeaderboardResponse>;
    /**
     * Get user's position in leaderboard
     */
    getUserPosition(userId: string): Promise<{
        position: number;
        entry: LeaderboardEntry | null;
        totalUsers: number;
    }>;
    /**
     * Get leaderboard around a specific user
     */
    getLeaderboardAroundUser(userId: string, range?: number): Promise<{
        leaderboard: LeaderboardEntry[];
        userPosition: number;
        totalUsers: number;
    }>;
    /**
     * Get leaderboard statistics
     */
    getLeaderboardStats(): Promise<{
        totalUsers: number;
        totalGames: number;
        averageDeviation: number;
        bestOverallDeviation: number;
        mostActiveUser: {
            username: string;
            gameCount: number;
        } | null;
    }>;
    /**
     * Get top performers by different metrics
     */
    getTopPerformers(): Promise<{
        topByAverage: LeaderboardEntry[];
        topByBest: LeaderboardEntry[];
        topByGames: LeaderboardEntry[];
    }>;
    /**
     * Calculate percentile rank for a user
     */
    getUserPercentile(userId: string): Promise<number>;
}
export declare const leaderboardService: LeaderboardService;
export default leaderboardService;
//# sourceMappingURL=LeaderboardService.d.ts.map