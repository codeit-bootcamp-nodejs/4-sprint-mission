import request from 'supertest';
import app from '../app';
import { prisma } from '../utils/prisma';
import { clearDatabase } from '../utils/testUtils';

describe('Auth API Integration Tests', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'user@test.com',
        password: 'testpass123',
        nickname: 'TestNickname',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.nickname).toBe(newUser.nickname);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 when email already exists', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'password123',
        nickname: 'User One',
      };

      await request(app).post('/auth/register').send(userData);

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidData = [
        { password: 'pass123', nickname: 'Test' },
        { email: 'test@example.com', nickname: 'Test' },
        { email: 'test@example.com', password: 'pass123' },
      ];

      for (const data of invalidData) {
        const response = await request(app)
          .post('/auth/register')
          .send(data);

        expect(response.status).toBe(400);
      }
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      email: 'login@test.com',
      password: 'mypassword',
      nickname: 'LoginUser',
    };

    beforeEach(async () => {
      await request(app).post('/auth/register').send(testUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();

      const cookies = response.headers['set-cookie'];
      expect(cookies.some((cookie: string) => cookie.includes('access-token='))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('refresh-token='))).toBe(true);
    });

    it('should return 400 with wrong password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should return 400 with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'notexist@test.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookies', async () => {
      const agent = request.agent(app);

      await agent.post('/auth/register').send({
        email: 'logout@test.com',
        password: 'pass123',
        nickname: 'LogoutTest',
      });

      await agent.post('/auth/login').send({
        email: 'logout@test.com',
        password: 'pass123',
      });

      const response = await agent.post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Logout successful');
    });
  });
});
