import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Register a new user
     * POST /auth/register
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * Login existing user
     * POST /auth/login
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * Refresh user token
     * POST /auth/refresh
     */
    refreshToken(req: Request, res: Response): Promise<void>;
    /**
     * Get current user info
     * GET /auth/me
     */
    getMe(req: Request, res: Response): Promise<void>;
    /**
     * Logout user (client should discard token)
     * POST /auth/logout
     */
    logout(req: Request, res: Response): Promise<void>;
}
export declare const authController: AuthController;
export default authController;
//# sourceMappingURL=AuthController.d.ts.map