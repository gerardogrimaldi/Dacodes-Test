import { GameSession, GameStartResponse, GameStopResponse } from '../types';
declare class GameService {
    /**
     * Start a new game session for a user
     */
    startGame(userId: string): Promise<GameStartResponse>;
    /**
     * Stop a game session and calculate results
     */
    stopGame(userId: string, sessionId?: string): Promise<GameStopResponse>;
    /**
     * Get user's game statistics
     */
    getUserStats(userId: string): Promise<{
        totalGames: number;
        completedGames: number;
        averageDeviation: number;
        bestDeviation: number;
        recentSessions: GameSession[];
    }>;
    /**
     * Get active session for a user
     */
    getActiveSession(userId: string): Promise<GameSession | null>;
    /**
     * Clean up expired sessions (utility method)
     */
    cleanupExpiredSessions(): Promise<number>;
}
export declare const gameService: GameService;
export default gameService;
//# sourceMappingURL=GameService.d.ts.map