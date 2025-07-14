import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import gameRoutes from './routes/games';
import leaderboardRoutes from './routes/leaderboard';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting (disabled in test environment)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 10000 : 100, // Higher limit for tests
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// More strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 10000 : 10, // Higher limit for tests
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/auth', authLimiter, authRoutes);
app.use('/games', gameRoutes);
app.use('/leaderboard', leaderboardRoutes);

// API documentation endpoint (basic info)
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Time It Right Game API',
    version: '1.0.0',
    description: 'A game timer system where users try to stop a timer exactly at 10 seconds',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login existing user',
        'POST /auth/refresh': 'Refresh user token',
        'GET /auth/me': 'Get current user info (requires auth)',
        'POST /auth/logout': 'Logout user (requires auth)'
      },
      games: {
        'POST /games/:userId/start': 'Start a new game session (requires auth)',
        'POST /games/:userId/stop': 'Stop a game session (requires auth)',
        'GET /games/:userId/stats': 'Get user statistics (requires auth)',
        'GET /games/:userId/active': 'Get active session (requires auth)',
        'POST /games/cleanup': 'Cleanup expired sessions (requires auth)'
      },
      leaderboard: {
        'GET /leaderboard': 'Get top leaderboard entries',
        'GET /leaderboard/stats': 'Get leaderboard statistics',
        'GET /leaderboard/top-performers': 'Get top performers by different metrics',
        'GET /leaderboard/user/:userId': 'Get user position in leaderboard',
        'GET /leaderboard/user/:userId/around': 'Get leaderboard around user',
        'GET /leaderboard/user/:userId/percentile': 'Get user percentile rank'
      }
    },
    gameRules: {
      target: '10 seconds (10,000 milliseconds)',
      sessionTimeout: '30 minutes',
      scoring: 'Lower average deviation from 10 seconds is better'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error.message 
    })
  });
});

export default app; 