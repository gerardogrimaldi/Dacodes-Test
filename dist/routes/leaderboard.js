"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LeaderboardController_1 = require("../controllers/LeaderboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route GET /leaderboard
 * @desc Get top leaderboard entries
 * @access Public
 */
router.get('/', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getLeaderboard.bind(LeaderboardController_1.leaderboardController));
/**
 * @route GET /leaderboard/stats
 * @desc Get leaderboard statistics
 * @access Public
 */
router.get('/stats', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getLeaderboardStats.bind(LeaderboardController_1.leaderboardController));
/**
 * @route GET /leaderboard/top-performers
 * @desc Get top performers by different metrics
 * @access Public
 */
router.get('/top-performers', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getTopPerformers.bind(LeaderboardController_1.leaderboardController));
/**
 * @route GET /leaderboard/user/:userId
 * @desc Get user's position in leaderboard
 * @access Public
 */
router.get('/user/:userId', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getUserPosition.bind(LeaderboardController_1.leaderboardController));
/**
 * @route GET /leaderboard/user/:userId/around
 * @desc Get leaderboard around a specific user
 * @access Public
 */
router.get('/user/:userId/around', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getLeaderboardAroundUser.bind(LeaderboardController_1.leaderboardController));
/**
 * @route GET /leaderboard/user/:userId/percentile
 * @desc Get user's percentile rank
 * @access Public
 */
router.get('/user/:userId/percentile', auth_1.optionalAuth, LeaderboardController_1.leaderboardController.getUserPercentile.bind(LeaderboardController_1.leaderboardController));
exports.default = router;
//# sourceMappingURL=leaderboard.js.map