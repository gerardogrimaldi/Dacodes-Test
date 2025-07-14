import { Request, Response } from 'express';
import { gameService } from '../services/GameService';

export class GameController {
  /**
   * Start a new game session
   * POST /games/:userId/start
   */
  async startGame(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      // Start game
      const gameResponse = await gameService.startGame(userId);

      res.status(201).json({
        message: 'Game started successfully',
        data: gameResponse
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start game';
      const statusCode = message.includes('not found') ? 404 : 400;

      res.status(statusCode).json({
        error: message
      });
    }
  }

  /**
   * Stop a game session
   * POST /games/:userId/stop
   */
  async stopGame(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { sessionId } = req.body;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      // Stop game
      const gameResponse = await gameService.stopGame(userId, sessionId);

      res.status(200).json({
        message: 'Game stopped successfully',
        data: gameResponse
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop game';
      
      let statusCode = 400;
      if (message.includes('not found')) {
        statusCode = 404;
      } else if (message.includes('Unauthorized')) {
        statusCode = 403;
      } else if (message.includes('expired')) {
        statusCode = 410; // Gone
      }

      res.status(statusCode).json({
        error: message
      });
    }
  }

  /**
   * Get user's game statistics
   * GET /games/:userId/stats
   */
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      // Get stats
      const stats = await gameService.getUserStats(userId);

      res.status(200).json({
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user stats';
      const statusCode = message.includes('not found') ? 404 : 400;

      res.status(statusCode).json({
        error: message
      });
    }
  }

  /**
   * Get user's active session
   * GET /games/:userId/active
   */
  async getActiveSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate user ID
      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      // Get active session
      const activeSession = await gameService.getActiveSession(userId);

      if (!activeSession) {
        res.status(200).json({
          message: 'No active session found',
          data: null
        });
        return;
      }

      res.status(200).json({
        message: 'Active session retrieved successfully',
        data: activeSession
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get active session';
      const statusCode = message.includes('not found') ? 404 : 400;

      res.status(statusCode).json({
        error: message
      });
    }
  }

  /**
   * Get detailed session information
   * GET /games/:userId/sessions/:sessionId
   */
  async getSessionDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId, sessionId } = req.params;

      // Validate parameters
      if (!userId || !sessionId) {
        res.status(400).json({
          error: 'User ID and session ID are required'
        });
        return;
      }

      // This would typically be implemented in the game service
      // For now, we'll return a simple response
      res.status(501).json({
        error: 'Session details endpoint not implemented yet'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get session details';
      
      res.status(500).json({
        error: message
      });
    }
  }

  /**
   * Clean up expired sessions (admin endpoint)
   * POST /games/cleanup
   */
  async cleanupExpiredSessions(req: Request, res: Response): Promise<void> {
    try {
      const cleanedCount = await gameService.cleanupExpiredSessions();

      res.status(200).json({
        message: 'Expired sessions cleaned up successfully',
        data: {
          cleanedCount
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cleanup expired sessions';
      
      res.status(500).json({
        error: message
      });
    }
  }
}

export const gameController = new GameController();
export default gameController; 