import { User, GameSession, LeaderboardEntry } from '../types';
/**
 * In-memory database store for the Time It Right game
 * This would be replaced with Redis or a proper database in production
 */
declare class InMemoryStore {
    private users;
    private usersByUsername;
    private gameSessions;
    private userSessions;
    createUser(username: string, passwordHash: string): User;
    getUserById(id: string): User | undefined;
    getUserByUsername(username: string): User | undefined;
    getAllUsers(): User[];
    createGameSession(userId: string, startTime: number): GameSession;
    getGameSessionById(id: string): GameSession | undefined;
    updateGameSession(id: string, updates: Partial<GameSession>): GameSession | undefined;
    getUserSessions(userId: string): GameSession[];
    getCompletedUserSessions(userId: string): GameSession[];
    generateLeaderboard(limit?: number): LeaderboardEntry[];
    getTotalUsers(): number;
    getTotalSessions(): number;
    getTotalCompletedSessions(): number;
    clearAllData(): void;
    getActiveUserSessions(userId: string): GameSession[];
}
export declare const inMemoryStore: InMemoryStore;
export default inMemoryStore;
//# sourceMappingURL=InMemoryStore.d.ts.map