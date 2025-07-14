import { User, AuthRequest, AuthResponse, JwtPayload } from '../types';
declare class AuthService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly SALT_ROUNDS;
    /**
     * Register a new user
     */
    register(authRequest: AuthRequest): Promise<AuthResponse>;
    /**
     * Login existing user
     */
    login(authRequest: AuthRequest): Promise<AuthResponse>;
    /**
     * Generate JWT token for user
     */
    private generateToken;
    /**
     * Verify JWT token
     */
    verifyToken(token: string): JwtPayload;
    /**
     * Get user from token
     */
    getUserFromToken(token: string): User | null;
    /**
     * Refresh token (generate new token for existing user)
     */
    refreshToken(token: string): string;
    /**
     * Check if token is expired
     */
    isTokenExpired(token: string): boolean;
}
export declare const authService: AuthService;
export default authService;
//# sourceMappingURL=AuthService.d.ts.map