"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', AuthController_1.authController.register.bind(AuthController_1.authController));
/**
 * @route POST /auth/login
 * @desc Login existing user
 * @access Public
 */
router.post('/login', AuthController_1.authController.login.bind(AuthController_1.authController));
/**
 * @route POST /auth/refresh
 * @desc Refresh user token
 * @access Public (requires valid token)
 */
router.post('/refresh', AuthController_1.authController.refreshToken.bind(AuthController_1.authController));
/**
 * @route GET /auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', auth_1.authenticateToken, AuthController_1.authController.getMe.bind(AuthController_1.authController));
/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', auth_1.authenticateToken, AuthController_1.authController.logout.bind(AuthController_1.authController));
exports.default = router;
//# sourceMappingURL=auth.js.map