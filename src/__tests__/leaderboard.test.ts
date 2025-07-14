import request from 'supertest';
import app from '../app';
import { inMemoryStore } from '../models/InMemoryStore';

describe('Leaderboard Endpoints', () => {
  let user1Token: string;
  let user1Id: string;
  let user2Token: string;
  let user2Id: string;

  beforeEach(async () => {
    // Clear data before each test
    inMemoryStore.clearAllData();

    // Register two users for testing
    const user1Response = await request(app)
      .post('/auth/register')
      .send({
        username: 'user1',
        password: 'password123'
      });
    
    user1Token = user1Response.body.data.token;
    user1Id = user1Response.body.data.user.id;

    const user2Response = await request(app)
      .post('/auth/register')
      .send({
        username: 'user2',
        password: 'password123'
      });
    
    user2Token = user2Response.body.data.token;
    user2Id = user2Response.body.data.user.id;
  });

  describe('GET /leaderboard', () => {
    it('should return empty leaderboard when no completed games', async () => {
      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.message).toBe('Leaderboard retrieved successfully');
      expect(response.body.data.leaderboard).toEqual([]);
      expect(response.body.data.totalEntries).toBe(0);
    });

    it('should return leaderboard with completed games', async () => {
      // User 1 completes a game
      const startResponse1 = await request(app)
        .post(`/games/${user1Id}/start`)
        .set('Authorization', `Bearer ${user1Token}`);

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .post(`/games/${user1Id}/stop`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ sessionId: startResponse1.body.data.sessionId });

      // User 2 completes a game
      const startResponse2 = await request(app)
        .post(`/games/${user2Id}/start`)
        .set('Authorization', `Bearer ${user2Token}`);

      await new Promise(resolve => setTimeout(resolve, 200));

      await request(app)
        .post(`/games/${user2Id}/stop`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ sessionId: startResponse2.body.data.sessionId });

      // Check leaderboard
      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.data.leaderboard).toHaveLength(2);
      expect(response.body.data.totalEntries).toBe(2);
      
      // Check structure
      const entry = response.body.data.leaderboard[0];
      expect(entry.userId).toBeDefined();
      expect(entry.username).toBeDefined();
      expect(entry.totalGames).toBeDefined();
      expect(entry.averageDeviation).toBeDefined();
      expect(entry.bestDeviation).toBeDefined();
    });

    it('should respect limit parameter', async () => {
      // Create multiple users and games (simplified for this test)
      const response = await request(app)
        .get('/leaderboard?limit=5')
        .expect(200);

      expect(response.body.data.leaderboard.length).toBeLessThanOrEqual(5);
    });

    it('should reject invalid limit parameter', async () => {
      const response = await request(app)
        .get('/leaderboard?limit=150')
        .expect(400);

      expect(response.body.error).toContain('Limit must be between 1 and 100');
    });
  });

  describe('GET /leaderboard/user/:userId', () => {
    it('should return user position when user has completed games', async () => {
      // User completes a game
      const startResponse = await request(app)
        .post(`/games/${user1Id}/start`)
        .set('Authorization', `Bearer ${user1Token}`);

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .post(`/games/${user1Id}/stop`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ sessionId: startResponse.body.data.sessionId });

      // Get user position
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}`)
        .expect(200);

      expect(response.body.message).toBe('User position retrieved successfully');
      expect(response.body.data.position).toBe(1);
      expect(response.body.data.entry).toBeDefined();
      expect(response.body.data.entry.userId).toBe(user1Id);
      expect(response.body.data.totalUsers).toBe(1);
    });

    it('should return position 0 when user has no completed games', async () => {
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}`)
        .expect(200);

      expect(response.body.data.position).toBe(0);
      expect(response.body.data.entry).toBeNull();
    });
  });

  describe('GET /leaderboard/user/:userId/around', () => {
    it('should return leaderboard around user', async () => {
      // User completes a game
      const startResponse = await request(app)
        .post(`/games/${user1Id}/start`)
        .set('Authorization', `Bearer ${user1Token}`);

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .post(`/games/${user1Id}/stop`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ sessionId: startResponse.body.data.sessionId });

      // Get leaderboard around user
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}/around?range=3`)
        .expect(200);

      expect(response.body.message).toBe('Leaderboard around user retrieved successfully');
      expect(response.body.data.leaderboard).toHaveLength(1);
      expect(response.body.data.userPosition).toBe(1);
      expect(response.body.data.totalUsers).toBe(1);
    });

    it('should return empty for user with no games', async () => {
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}/around`)
        .expect(200);

      expect(response.body.data.leaderboard).toEqual([]);
      expect(response.body.data.userPosition).toBe(0);
    });

    it('should reject invalid range parameter', async () => {
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}/around?range=100`)
        .expect(400);

      expect(response.body.error).toContain('Range must be between 1 and 50');
    });
  });

  describe('GET /leaderboard/stats', () => {
    it('should return leaderboard statistics', async () => {
      const response = await request(app)
        .get('/leaderboard/stats')
        .expect(200);

      expect(response.body.message).toBe('Leaderboard statistics retrieved successfully');
      expect(response.body.data.totalUsers).toBeDefined();
      expect(response.body.data.totalGames).toBeDefined();
      expect(response.body.data.averageDeviation).toBeDefined();
      expect(response.body.data.bestOverallDeviation).toBeDefined();
      expect(response.body.data.mostActiveUser).toBeDefined();
    });

    it('should return proper stats when games exist', async () => {
      // User completes a game
      const startResponse = await request(app)
        .post(`/games/${user1Id}/start`)
        .set('Authorization', `Bearer ${user1Token}`);

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .post(`/games/${user1Id}/stop`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ sessionId: startResponse.body.data.sessionId });

      const response = await request(app)
        .get('/leaderboard/stats')
        .expect(200);

      expect(response.body.data.totalUsers).toBe(2); // 2 registered users
      expect(response.body.data.totalGames).toBe(1); // 1 completed game
      expect(response.body.data.mostActiveUser.username).toBe('user1');
      expect(response.body.data.mostActiveUser.gameCount).toBe(1);
    });
  });

  describe('GET /leaderboard/top-performers', () => {
    it('should return top performers by different metrics', async () => {
      const response = await request(app)
        .get('/leaderboard/top-performers')
        .expect(200);

      expect(response.body.message).toBe('Top performers retrieved successfully');
      expect(response.body.data.topByAverage).toBeDefined();
      expect(response.body.data.topByBest).toBeDefined();
      expect(response.body.data.topByGames).toBeDefined();
      expect(Array.isArray(response.body.data.topByAverage)).toBe(true);
      expect(Array.isArray(response.body.data.topByBest)).toBe(true);
      expect(Array.isArray(response.body.data.topByGames)).toBe(true);
    });
  });

  describe('GET /leaderboard/user/:userId/percentile', () => {
    it('should return user percentile', async () => {
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}/percentile`)
        .expect(200);

      expect(response.body.message).toBe('User percentile retrieved successfully');
      expect(response.body.data.userId).toBe(user1Id);
      expect(response.body.data.percentile).toBeDefined();
      expect(typeof response.body.data.percentile).toBe('number');
    });

    it('should return 0 percentile for user with no games', async () => {
      const response = await request(app)
        .get(`/leaderboard/user/${user1Id}/percentile`)
        .expect(200);

      expect(response.body.data.percentile).toBe(0);
    });
  });

  describe('Leaderboard Integration Test', () => {
    it('should properly rank users by average deviation', async () => {
      // User 1 plays and gets close to 10 seconds (better score)
      let startResponse = await request(app)
        .post(`/games/${user1Id}/start`)
        .set('Authorization', `Bearer ${user1Token}`);

      await new Promise(resolve => setTimeout(resolve, 50)); // ~50ms deviation

      await request(app)
        .post(`/games/${user1Id}/stop`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ sessionId: startResponse.body.data.sessionId });

      // User 2 plays and gets further from 10 seconds (worse score)
      startResponse = await request(app)
        .post(`/games/${user2Id}/start`)
        .set('Authorization', `Bearer ${user2Token}`);

      await new Promise(resolve => setTimeout(resolve, 1000)); // ~1000ms deviation

      await request(app)
        .post(`/games/${user2Id}/stop`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ sessionId: startResponse.body.data.sessionId });

      // Check leaderboard ranking
      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.data.leaderboard).toHaveLength(2);
      
      // User 1 should be first (better/lower deviation)
      expect(response.body.data.leaderboard[0].username).toBe('user1');
      expect(response.body.data.leaderboard[1].username).toBe('user2');
      
      // User 1 should have lower average deviation
      expect(response.body.data.leaderboard[0].averageDeviation)
        .toBeLessThan(response.body.data.leaderboard[1].averageDeviation);
    });
  });
}); 