export interface User {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}
export interface GameSession {
    id: string;
    userId: string;
    startTime: number;
    endTime?: number;
    deviation?: number;
    isCompleted: boolean;
    createdAt: Date;
}
export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalGames: number;
    averageDeviation: number;
    bestDeviation: number;
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
    actualDuration: number;
    targetDuration: number;
    deviation: number;
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
export declare const TARGET_DURATION = 10000;
export declare const SESSION_TIMEOUT: number;
export declare const ACCEPTABLE_DEVIATION = 500;
//# sourceMappingURL=index.d.ts.map