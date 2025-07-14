"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameController_1 = require("../controllers/GameController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route POST /games/:userId/start
 * @desc Start a new game session
 * @access Private (user must be authenticated and match userId)
 */
router.post('/:userId/start', auth_1.authenticateToken, auth_1.validateUserAccess, GameController_1.gameController.startGame.bind(GameController_1.gameController));
/**
 * @route POST /games/:userId/stop
 * @desc Stop a game session
 * @access Private (user must be authenticated and match userId)
 */
router.post('/:userId/stop', auth_1.authenticateToken, auth_1.validateUserAccess, GameController_1.gameController.stopGame.bind(GameController_1.gameController));
/**
 * @route GET /games/:userId/stats
 * @desc Get user's game statistics
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/stats', auth_1.authenticateToken, auth_1.validateUserAccess, GameController_1.gameController.getUserStats.bind(GameController_1.gameController));
/**
 * @route GET /games/:userId/active
 * @desc Get user's active game session
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/active', auth_1.authenticateToken, auth_1.validateUserAccess, GameController_1.gameController.getActiveSession.bind(GameController_1.gameController));
/**
 * @route GET /games/:userId/sessions/:sessionId
 * @desc Get detailed session information
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/sessions/:sessionId', auth_1.authenticateToken, auth_1.validateUserAccess, GameController_1.gameController.getSessionDetails.bind(GameController_1.gameController));
/**
 * @route POST /games/cleanup
 * @desc Clean up expired sessions (admin function)
 * @access Private (requires authentication)
 */
router.post('/cleanup', auth_1.authenticateToken, GameController_1.gameController.cleanupExpiredSessions.bind(GameController_1.gameController));
exports.default = router;
//# sourceMappingURL=games.js.map