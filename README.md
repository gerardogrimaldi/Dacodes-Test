# Time It Right Game API

A Node.js/TypeScript game timer system where users try to stop a timer exactly at 10 seconds. Users compete on a leaderboard ranked by their average deviation from the target time.

## 🎯 Game Overview

- **Objective**: Stop the timer as close to exactly 10 seconds as possible
- **Target Time**: 10,000 milliseconds (10 seconds)
- **Session Timeout**: 30 minutes
- **Scoring**: Lower average deviation from 10 seconds is better
- **Leaderboard**: Top 10 users ranked by average deviation

## 🚀 Features

- **JWT Authentication**: Secure user registration and login
- **Game Sessions**: Start/stop timer functionality with precise timing
- **Leaderboard System**: Real-time ranking based on average deviation
- **Statistics**: User performance tracking and analytics
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error responses
- **TypeScript**: Full type safety and modern development

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: In-memory storage (easily replaceable with Redis/PostgreSQL)
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest with Supertest
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd time-it-right-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory (optional - defaults will be used):
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "player1",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "player1",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Game Endpoints

#### Start Game Session
```http
POST /games/:userId/start
Authorization: Bearer <jwt-token>
```

#### Stop Game Session
```http
POST /games/:userId/stop
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "sessionId": "optional-session-id"
}
```

#### Get User Statistics
```http
GET /games/:userId/stats
Authorization: Bearer <jwt-token>
```

#### Get Active Session
```http
GET /games/:userId/active
Authorization: Bearer <jwt-token>
```

### Leaderboard Endpoints

#### Get Top Leaderboard
```http
GET /leaderboard?limit=10
```

#### Get User Position
```http
GET /leaderboard/user/:userId
```

#### Get Leaderboard Around User
```http
GET /leaderboard/user/:userId/around?range=5
```

#### Get Leaderboard Statistics
```http
GET /leaderboard/stats
```

## 🎮 How to Play

1. **Register/Login**: Create an account or login to get a JWT token
2. **Start Game**: Send a POST request to `/games/:userId/start`
3. **Wait 10 seconds**: Count in your head or use external timing
4. **Stop Game**: Send a POST request to `/games/:userId/stop`
5. **View Results**: Check your deviation and see how you rank
6. **Check Leaderboard**: View top players at `/leaderboard`

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │     Models      │
│                 │    │                 │    │                 │
│ • AuthController│────│ • AuthService   │────│ • InMemoryStore │
│ • GameController│    │ • GameService   │    │ • User          │
│ • LeaderboardCtrl│   │ • LeaderboardSvc│    │ • GameSession   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Routes      │    │   Middleware    │    │   Utilities     │
│                 │    │                 │    │                 │
│ • auth.ts       │    │ • Authentication│    │ • ID Generation │
│ • games.ts      │    │ • Rate Limiting │    │ • Time Utils    │
│ • leaderboard.ts│    │ • Error Handling│    │ • Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Leaderboard Logic

The leaderboard ranks users based on their **average deviation** from the target time (10 seconds):

1. **Calculation**: For each completed game, we calculate `|actualTime - 10000|` ms
2. **Averaging**: We take the mean of all deviations for each user
3. **Ranking**: Users are sorted by average deviation (ascending - lower is better)
4. **Display Format**:
   ```
   UserID | Total Games | Average Deviation (ms) | Best Deviation (ms)
   ```

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication with configurable expiration
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Global and auth-specific rate limits
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and protection
- **Input Validation**: Comprehensive request validation

## 🏎️ Performance Considerations

- **In-Memory Storage**: Fast data access (easily replaceable with Redis)
- **Efficient Leaderboard**: O(n log n) sorting with caching potential
- **Connection Pooling**: Ready for database integration
- **Rate Limiting**: Prevents abuse and ensures fair resource usage

## 🚀 Scalability Plan

### For 10,000+ Users:

1. **Database Migration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Caching Layer**: Implement Redis for sessions and leaderboard caching
3. **Load Balancing**: Add multiple server instances behind a load balancer
4. **Session Management**: Implement distributed sessions with Redis
5. **Database Optimization**: Add indexes, connection pooling, and query optimization
6. **Monitoring**: Add metrics, logging, and health checks
7. **CDN**: Serve static assets from CDN
8. **Microservices**: Split into auth, game, and leaderboard services

### Production Improvements:

1. **Environment Variables**: Proper secrets management
2. **Logging**: Structured logging with Winston
3. **Monitoring**: Prometheus metrics and Grafana dashboards
4. **Testing**: Comprehensive unit and integration tests
5. **CI/CD**: Automated testing and deployment pipelines
6. **Documentation**: OpenAPI/Swagger documentation
7. **Error Tracking**: Sentry or similar error tracking service

## 🧩 API Response Format

All API responses follow this consistent format:

```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## 🔄 Game Session Flow

1. **Authentication**: User authenticates and receives JWT token
2. **Session Start**: POST to `/games/:userId/start` creates new session
3. **Timing**: Server records precise start timestamp
4. **Session Stop**: POST to `/games/:userId/stop` calculates deviation
5. **Scoring**: Deviation from 10 seconds is calculated and stored
6. **Leaderboard Update**: User's average deviation is recalculated
7. **Cleanup**: Expired sessions are automatically handled

## 🎯 Edge Cases Handled

- **Multiple Active Sessions**: Only one active session per user
- **Session Timeouts**: 30-minute automatic timeout
- **Invalid Tokens**: Proper JWT validation and error handling
- **Concurrent Requests**: Session state management
- **User Authorization**: Users can only access their own resources
- **Invalid Session IDs**: Proper error responses
- **Rate Limiting**: Protection against abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Challenge Requirements**: Implements exact specifications from the technical requirements
- **AI Assistance**: Parts of this codebase were generated with ChatGPT assistance as per challenge guidelines
- **Best Practices**: Follows Node.js and TypeScript best practices for production-ready applications 