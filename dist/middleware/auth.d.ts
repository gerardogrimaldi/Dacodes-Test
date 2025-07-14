import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
            };
        }
    }
}
/**
 * Middleware to authenticate JWT tokens
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to extract user from token if present (optional auth)
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to validate user ID parameter matches authenticated user
 */
export declare const validateUserAccess: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map