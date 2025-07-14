import { Request, Response } from 'express';
export declare class LeaderboardController {
    /**
     * Get top leaderboard entries
     * GET /leaderboard
     */
    getLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * Get user's position in leaderboard
     * GET /leaderboard/user/:userId
     */
    getUserPosition(req: Request, res: Response): Promise<void>;
    /**
     * Get leaderboard around a specific user
     * GET /leaderboard/user/:userId/around
     */
    getLeaderboardAroundUser(req: Request, res: Response): Promise<void>;
    /**
     * Get leaderboard statistics
     * GET /leaderboard/stats
     */
    getLeaderboardStats(req: Request, res: Response): Promise<void>;
    /**
     * Get top performers by different metrics
     * GET /leaderboard/top-performers
     */
    getTopPerformers(req: Request, res: Response): Promise<void>;
    /**
     * Get user's percentile rank
     * GET /leaderboard/user/:userId/percentile
     */
    getUserPercentile(req: Request, res: Response): Promise<void>;
}
export declare const leaderboardController: LeaderboardController;
export default leaderboardController;
//# sourceMappingURL=LeaderboardController.d.ts.map