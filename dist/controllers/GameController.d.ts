import { Request, Response } from 'express';
export declare class GameController {
    /**
     * Start a new game session
     * POST /games/:userId/start
     */
    startGame(req: Request, res: Response): Promise<void>;
    /**
     * Stop a game session
     * POST /games/:userId/stop
     */
    stopGame(req: Request, res: Response): Promise<void>;
    /**
     * Get user's game statistics
     * GET /games/:userId/stats
     */
    getUserStats(req: Request, res: Response): Promise<void>;
    /**
     * Get user's active session
     * GET /games/:userId/active
     */
    getActiveSession(req: Request, res: Response): Promise<void>;
    /**
     * Get detailed session information
     * GET /games/:userId/sessions/:sessionId
     */
    getSessionDetails(req: Request, res: Response): Promise<void>;
    /**
     * Clean up expired sessions (admin endpoint)
     * POST /games/cleanup
     */
    cleanupExpiredSessions(req: Request, res: Response): Promise<void>;
}
export declare const gameController: GameController;
export default gameController;
//# sourceMappingURL=GameController.d.ts.map