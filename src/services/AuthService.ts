import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, AuthRequest, AuthResponse, JwtPayload } from '../types';
import { inMemoryStore } from '../models/InMemoryStore';
import { isValidUsername, isValidPassword } from '../utils';

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  private readonly SALT_ROUNDS = 12;

  /**
   * Register a new user
   */
  async register(authRequest: AuthRequest): Promise<AuthResponse> {
    const { username, password } = authRequest;

    // Validate input
    if (!isValidUsername(username)) {
      throw new Error('Invalid username format. Username must be 3-20 characters long and contain only letters, numbers, and underscores.');
    }

    if (!isValidPassword(password)) {
      throw new Error('Invalid password. Password must be at least 6 characters long.');
    }

    // Check if user already exists
    const existingUser = inMemoryStore.getUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = inMemoryStore.createUser(username, passwordHash);

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  }

  /**
   * Login existing user
   */
  async login(authRequest: AuthRequest): Promise<AuthResponse> {
    const { username, password } = authRequest;

    // Find user
    const user = inMemoryStore.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(user: User): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.id,
      username: user.username
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user from token
   */
  getUserFromToken(token: string): User | null {
    try {
      const payload = this.verifyToken(token);
      return inMemoryStore.getUserById(payload.userId) || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh token (generate new token for existing user)
   */
  refreshToken(token: string): string {
    const payload = this.verifyToken(token);
    const user = inMemoryStore.getUserById(payload.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return this.generateToken(user);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.verifyToken(token);
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService; 