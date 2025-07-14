import { User, GameSession, LeaderboardEntry } from '../types';
import { generateId } from '../utils';

/**
 * In-memory database store for the Time It Right game
 * This would be replaced with Redis or a proper database in production
 */
class InMemoryStore {
  private users: Map<string, User> = new Map();
  private usersByUsername: Map<string, User> = new Map();
  private gameSessions: Map<string, GameSession> = new Map();
  private userSessions: Map<string, string[]> = new Map(); // userId -> sessionIds[]

  // User operations
  createUser(username: string, passwordHash: string): User {
    const user: User = {
      id: generateId(),
      username,
      passwordHash,
      createdAt: new Date()
    };

    this.users.set(user.id, user);
    this.usersByUsername.set(username, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.usersByUsername.get(username);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Game session operations
  createGameSession(userId: string, startTime: number): GameSession {
    const session: GameSession = {
      id: generateId(),
      userId,
      startTime,
      isCompleted: false,
      createdAt: new Date()
    };

    this.gameSessions.set(session.id, session);
    
    // Track sessions by user
    const userSessionIds = this.userSessions.get(userId) || [];
    userSessionIds.push(session.id);
    this.userSessions.set(userId, userSessionIds);

    return session;
  }

  getGameSessionById(id: string): GameSession | undefined {
    return this.gameSessions.get(id);
  }

  updateGameSession(id: string, updates: Partial<GameSession>): GameSession | undefined {
    const session = this.gameSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }

  getUserSessions(userId: string): GameSession[] {
    const sessionIds = this.userSessions.get(userId) || [];
    return sessionIds
      .map(id => this.gameSessions.get(id))
      .filter(session => session !== undefined) as GameSession[];
  }

  getCompletedUserSessions(userId: string): GameSession[] {
    return this.getUserSessions(userId).filter(session => session.isCompleted);
  }

  // Leaderboard operations
  generateLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const leaderboard: LeaderboardEntry[] = [];

    for (const user of this.users.values()) {
      const completedSessions = this.getCompletedUserSessions(user.id);
      
      if (completedSessions.length === 0) continue;

      const deviations = completedSessions
        .map(session => session.deviation!)
        .filter(deviation => !isNaN(deviation));

      if (deviations.length === 0) continue;

      const averageDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
      const bestDeviation = Math.min(...deviations);

      leaderboard.push({
        userId: user.id,
        username: user.username,
        totalGames: completedSessions.length,
        averageDeviation: Math.round(averageDeviation * 100) / 100, // Round to 2 decimal places
        bestDeviation: Math.round(bestDeviation * 100) / 100
      });
    }

    // Sort by average deviation (ascending - lower is better)
    leaderboard.sort((a, b) => a.averageDeviation - b.averageDeviation);

    return leaderboard.slice(0, limit);
  }

  // Analytics and stats
  getTotalUsers(): number {
    return this.users.size;
  }

  getTotalSessions(): number {
    return this.gameSessions.size;
  }

  getTotalCompletedSessions(): number {
    return Array.from(this.gameSessions.values()).filter(session => session.isCompleted).length;
  }

  // Cleanup operations (useful for testing)
  clearAllData(): void {
    this.users.clear();
    this.usersByUsername.clear();
    this.gameSessions.clear();
    this.userSessions.clear();
  }

  // Get active (non-completed) sessions for a user
  getActiveUserSessions(userId: string): GameSession[] {
    return this.getUserSessions(userId).filter(session => !session.isCompleted);
  }
}

// Export singleton instance
export const inMemoryStore = new InMemoryStore();
export default inMemoryStore; 