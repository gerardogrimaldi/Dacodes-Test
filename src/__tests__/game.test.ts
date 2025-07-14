import request from 'supertest';
import app from '../app';
import { inMemoryStore } from '../models/InMemoryStore';

describe('Game Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Clear data before each test
    inMemoryStore.clearAllData();

    // Register and login to get token and userId
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  describe('POST /games/:userId/start', () => {
    it('should start a new game session successfully', async () => {
      const response = await request(app)
        .post(`/games/${userId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.message).toBe('Game started successfully');
      expect(response.body.data.sessionId).toBeDefined();
      expect(response.body.data.startTime).toBeDefined();
      expect(typeof response.body.data.startTime).toBe('number');
    });

    it('should reject start game without authentication', async () => {
      const response = await request(app)
        .post(`/games/${userId}/start`)
        .expect(401);

      expect(response.body.error).toContain('No token provided');
    });

    it('should reject start game for different user', async () => {
      const response = await request(app)
        .post('/games/different-user-id/start')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.error).toContain('You can only access your own resources');
    });
  });

  describe('POST /games/:userId/stop', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Start a game session first
      const response = await request(app)
        .post(`/games/${userId}/start`)
        .set('Authorization', `Bearer ${authToken}`);
      
      sessionId = response.body.data.sessionId;
    });

    it('should stop a game session successfully', async () => {
      // Wait a bit to simulate some game time
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .post(`/games/${userId}/stop`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionId })
        .expect(200);

      expect(response.body.message).toBe('Game stopped successfully');
      expect(response.body.data.sessionId).toBe(sessionId);
      expect(response.body.data.startTime).toBeDefined();
      expect(response.body.data.endTime).toBeDefined();
      expect(response.body.data.actualDuration).toBeDefined();
      expect(response.body.data.deviation).toBeDefined();
      expect(response.body.data.targetDuration).toBe(10000);
    });

    it('should stop most recent session without sessionId', async () => {
      // Wait a bit to simulate some game time
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .post(`/games/${userId}/stop`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Game stopped successfully');
      expect(response.body.data.sessionId).toBe(sessionId);
      expect(response.body.data.deviation).toBeDefined();
    });

    it('should reject stop game without active session', async () => {
      const response = await request(app)
        .post(`/games/${userId}/stop`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionId: 'non-existent-session' })
        .expect(404);

      expect(response.body.error).toContain('Game session not found');
    });

    it('should reject stop game without authentication', async () => {
      const response = await request(app)
        .post(`/games/${userId}/stop`)
        .expect(401);

      expect(response.body.error).toContain('No token provided');
    });
  });

  describe('GET /games/:userId/stats', () => {
    it('should return user statistics', async () => {
      const response = await request(app)
        .get(`/games/${userId}/stats`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('User statistics retrieved successfully');
      expect(response.body.data.totalGames).toBeDefined();
      expect(response.body.data.completedGames).toBeDefined();
      expect(response.body.data.averageDeviation).toBeDefined();
      expect(response.body.data.bestDeviation).toBeDefined();
      expect(response.body.data.recentSessions).toBeDefined();
      expect(Array.isArray(response.body.data.recentSessions)).toBe(true);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get(`/games/${userId}/stats`)
        .expect(401);

      expect(response.body.error).toContain('No token provided');
    });
  });

  describe('GET /games/:userId/active', () => {
    it('should return null when no active session', async () => {
      const response = await request(app)
        .get(`/games/${userId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('No active session found');
      expect(response.body.data).toBeNull();
    });

    it('should return active session when exists', async () => {
      // Start a game session first
      await request(app)
        .post(`/games/${userId}/start`)
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .get(`/games/${userId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Active session retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.startTime).toBeDefined();
      expect(response.body.data.isCompleted).toBe(false);
    });
  });

  describe('Game Flow Integration Test', () => {
    it('should complete a full game cycle', async () => {
      // 1. Start game
      const startResponse = await request(app)
        .post(`/games/${userId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      const sessionId = startResponse.body.data.sessionId;

      // 2. Check active session
      const activeResponse = await request(app)
        .get(`/games/${userId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(activeResponse.body.data.id).toBe(sessionId);

      // 3. Wait a bit and stop game
      await new Promise(resolve => setTimeout(resolve, 500));

      const stopResponse = await request(app)
        .post(`/games/${userId}/stop`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionId })
        .expect(200);

      expect(stopResponse.body.data.deviation).toBeDefined();

      // 4. Check stats updated
      const statsResponse = await request(app)
        .get(`/games/${userId}/stats`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statsResponse.body.data.completedGames).toBe(1);
      expect(statsResponse.body.data.totalGames).toBe(1);

      // 5. Check no more active session
      const noActiveResponse = await request(app)
        .get(`/games/${userId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(noActiveResponse.body.data).toBeNull();
    });
  });
}); 