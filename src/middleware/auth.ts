import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { JwtPayload } from '../types';

// Extend Express Request interface to include user information
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
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
      return;
    }

    // Verify token
    const payload: JwtPayload = authService.verifyToken(token);
    
    // Get user from database
    const user = authService.getUserFromToken(token);
    if (!user) {
      res.status(401).json({ 
        error: 'Access denied. Invalid token.' 
      });
      return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      username: user.username
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Access denied. Invalid token.' 
    });
  }
};

/**
 * Middleware to extract user from token if present (optional auth)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = authService.getUserFromToken(token);
      if (user) {
        req.user = {
          id: user.id,
          username: user.username
        };
      }
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};

/**
 * Middleware to validate user ID parameter matches authenticated user
 */
export const validateUserAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { userId } = req.params;
  
  if (!req.user) {
    res.status(401).json({ 
      error: 'Access denied. Authentication required.' 
    });
    return;
  }

  if (req.user.id !== userId) {
    res.status(403).json({ 
      error: 'Access denied. You can only access your own resources.' 
    });
    return;
  }

  next();
}; 