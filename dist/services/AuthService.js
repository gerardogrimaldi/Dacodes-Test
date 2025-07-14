"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const InMemoryStore_1 = require("../models/InMemoryStore");
const utils_1 = require("../utils");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
        this.SALT_ROUNDS = 12;
    }
    /**
     * Register a new user
     */
    async register(authRequest) {
        const { username, password } = authRequest;
        // Validate input
        if (!(0, utils_1.isValidUsername)(username)) {
            throw new Error('Invalid username format. Username must be 3-20 characters long and contain only letters, numbers, and underscores.');
        }
        if (!(0, utils_1.isValidPassword)(password)) {
            throw new Error('Invalid password. Password must be at least 6 characters long.');
        }
        // Check if user already exists
        const existingUser = InMemoryStore_1.inMemoryStore.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
        // Create user
        const user = InMemoryStore_1.inMemoryStore.createUser(username, passwordHash);
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
    async login(authRequest) {
        const { username, password } = authRequest;
        // Find user
        const user = InMemoryStore_1.inMemoryStore.getUserByUsername(username);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
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
    generateToken(user) {
        const payload = {
            userId: user.id,
            username: user.username
        };
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    /**
     * Get user from token
     */
    getUserFromToken(token) {
        try {
            const payload = this.verifyToken(token);
            return InMemoryStore_1.inMemoryStore.getUserById(payload.userId) || null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Refresh token (generate new token for existing user)
     */
    refreshToken(token) {
        const payload = this.verifyToken(token);
        const user = InMemoryStore_1.inMemoryStore.getUserById(payload.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.generateToken(user);
    }
    /**
     * Check if token is expired
     */
    isTokenExpired(token) {
        try {
            const payload = this.verifyToken(token);
            return Date.now() >= payload.exp * 1000;
        }
        catch (error) {
            return true;
        }
    }
}
exports.authService = new AuthService();
exports.default = exports.authService;
//# sourceMappingURL=AuthService.js.map