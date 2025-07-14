import { Router } from 'express';
import { gameController } from '../controllers/GameController';
import { authenticateToken, validateUserAccess } from '../middleware/auth';

const router = Router();

/**
 * @route POST /games/:userId/start
 * @desc Start a new game session
 * @access Private (user must be authenticated and match userId)
 */
router.post('/:userId/start', 
  authenticateToken, 
  validateUserAccess, 
  gameController.startGame.bind(gameController)
);

/**
 * @route POST /games/:userId/stop
 * @desc Stop a game session
 * @access Private (user must be authenticated and match userId)
 */
router.post('/:userId/stop', 
  authenticateToken, 
  validateUserAccess, 
  gameController.stopGame.bind(gameController)
);

/**
 * @route GET /games/:userId/stats
 * @desc Get user's game statistics
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/stats', 
  authenticateToken, 
  validateUserAccess, 
  gameController.getUserStats.bind(gameController)
);

/**
 * @route GET /games/:userId/active
 * @desc Get user's active game session
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/active', 
  authenticateToken, 
  validateUserAccess, 
  gameController.getActiveSession.bind(gameController)
);

/**
 * @route GET /games/:userId/sessions/:sessionId
 * @desc Get detailed session information
 * @access Private (user must be authenticated and match userId)
 */
router.get('/:userId/sessions/:sessionId', 
  authenticateToken, 
  validateUserAccess, 
  gameController.getSessionDetails.bind(gameController)
);

/**
 * @route POST /games/cleanup
 * @desc Clean up expired sessions (admin function)
 * @access Private (requires authentication)
 */
router.post('/cleanup', 
  authenticateToken, 
  gameController.cleanupExpiredSessions.bind(gameController)
);

export default router; 