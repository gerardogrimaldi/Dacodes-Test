export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface GameSession {
  id: string;
  userId: string;
  startTime: number; // milliseconds since epoch
  endTime?: number; // milliseconds since epoch
  deviation?: number; // milliseconds from target (10000ms)
  isCompleted: boolean;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalGames: number;
  averageDeviation: number; // milliseconds
  bestDeviation: number; // milliseconds
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface GameStartResponse {
  sessionId: string;
  message: string;
  startTime: number;
}

export interface GameStopResponse {
  sessionId: string;
  startTime: number;
  endTime: number;
  actualDuration: number; // milliseconds
  targetDuration: number; // milliseconds (10000)
  deviation: number; // milliseconds
  message: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  totalEntries: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

// Constants
export const TARGET_DURATION = 10000; // 10 seconds in milliseconds
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
export const ACCEPTABLE_DEVIATION = 500; // ±500ms for scoring 