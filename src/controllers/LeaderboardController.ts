import { Request, Response } from 'express';
import { leaderboardService } from '../services/LeaderboardService';

export class LeaderboardController {
  /**
   * Get top leaderboard entries
   * GET /leaderboard
   */
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      // Validate limit
      if (limit < 1 || limit > 100) {
        res.status(400).json({
          error: 'Limit must be between 1 and 100'
        });
        return;
      }

      const leaderboard = await leaderboardService.getLeaderboard(limit);

      res.status(200).json({
        message: 'Leaderboard retrieved successfully',
        data: leaderboard
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get leaderboard';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Get user's position in leaderboard
   * GET /leaderboard/user/:userId
   */
  async getUserPosition(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      const userPosition = await leaderboardService.getUserPosition(userId);

      res.status(200).json({
        message: 'User position retrieved successfully',
        data: userPosition
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user position';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Get leaderboard around a specific user
   * GET /leaderboard/user/:userId/around
   */
  async getLeaderboardAroundUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const range = parseInt(req.query.range as string) || 5;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      // Validate range
      if (range < 1 || range > 50) {
        res.status(400).json({
          error: 'Range must be between 1 and 50'
        });
        return;
      }

      const leaderboard = await leaderboardService.getLeaderboardAroundUser(userId, range);

      res.status(200).json({
        message: 'Leaderboard around user retrieved successfully',
        data: leaderboard
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get leaderboard around user';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Get leaderboard statistics
   * GET /leaderboard/stats
   */
  async getLeaderboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await leaderboardService.getLeaderboardStats();

      res.status(200).json({
        message: 'Leaderboard statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get leaderboard statistics';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Get top performers by different metrics
   * GET /leaderboard/top-performers
   */
  async getTopPerformers(req: Request, res: Response): Promise<void> {
    try {
      const performers = await leaderboardService.getTopPerformers();

      res.status(200).json({
        message: 'Top performers retrieved successfully',
        data: performers
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get top performers';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Get user's percentile rank
   * GET /leaderboard/user/:userId/percentile
   */
  async getUserPercentile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      const percentile = await leaderboardService.getUserPercentile(userId);

      res.status(200).json({
        message: 'User percentile retrieved successfully',
        data: {
          userId,
          percentile
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user percentile';
      
      res.status(500).json({
        error: message
      });
    }
  }
}

export const leaderboardController = new LeaderboardController();
export default leaderboardController; 