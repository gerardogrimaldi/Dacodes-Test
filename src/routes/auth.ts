import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route POST /auth/login
 * @desc Login existing user
 * @access Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route POST /auth/refresh
 * @desc Refresh user token
 * @access Public (requires valid token)
 */
router.post('/refresh', authController.refreshToken.bind(authController));

/**
 * @route GET /auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', authenticateToken, authController.getMe.bind(authController));

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticateToken, authController.logout.bind(authController));

export default router; 