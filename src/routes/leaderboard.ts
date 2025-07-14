import { Router } from 'express';
import { leaderboardController } from '../controllers/LeaderboardController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @route GET /leaderboard
 * @desc Get top leaderboard entries
 * @access Public
 */
router.get('/', 
  optionalAuth, 
  leaderboardController.getLeaderboard.bind(leaderboardController)
);

/**
 * @route GET /leaderboard/stats
 * @desc Get leaderboard statistics
 * @access Public
 */
router.get('/stats', 
  optionalAuth, 
  leaderboardController.getLeaderboardStats.bind(leaderboardController)
);

/**
 * @route GET /leaderboard/top-performers
 * @desc Get top performers by different metrics
 * @access Public
 */
router.get('/top-performers', 
  optionalAuth, 
  leaderboardController.getTopPerformers.bind(leaderboardController)
);

/**
 * @route GET /leaderboard/user/:userId
 * @desc Get user's position in leaderboard
 * @access Public
 */
router.get('/user/:userId', 
  optionalAuth, 
  leaderboardController.getUserPosition.bind(leaderboardController)
);

/**
 * @route GET /leaderboard/user/:userId/around
 * @desc Get leaderboard around a specific user
 * @access Public
 */
router.get('/user/:userId/around', 
  optionalAuth, 
  leaderboardController.getLeaderboardAroundUser.bind(leaderboardController)
);

/**
 * @route GET /leaderboard/user/:userId/percentile
 * @desc Get user's percentile rank
 * @access Public
 */
router.get('/user/:userId/percentile', 
  optionalAuth, 
  leaderboardController.getUserPercentile.bind(leaderboardController)
);

export default router; 