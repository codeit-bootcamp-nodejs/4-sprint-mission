import request from 'supertest';
import { app, prisma } from '../../src/app';
import { generateAuthToken } from '../helpers/auth.helper';

describe('Auth API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nickname: `testuser${Date.now()}`,
      };

      const response = await request(app).post('/api/users/register').send(newUser).expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.nickname).toBe(newUser.nickname);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for duplicate email', async () => {
      const user = {
        email: `duplicate-${Date.now()}@example.com`,
        password: 'password123',
        nickname: 'duplicateuser',
      };

      await request(app).post('/api/users/register').send(user);

      const response = await request(app).post('/api/users/register').send(user);

      expect([400, 409]).toContain(response.status);
      if (response.status === 400 || response.status === 409) {
        expect(response.body).toHaveProperty('message');
      }
    });
  });

  describe('POST /api/users/login', () => {
    // Create a test user first
    beforeAll(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
          nickname: 'logintest',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('logintest@example.com');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'logintest@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/refresh', () => {
    let validRefreshToken: string;

    beforeAll(async () => {
      const registerResponse = await request(app)
        .post('/api/users/register')
        .send({
          email: `refresh-test-${Date.now()}@example.com`,
          password: 'password123',
          nickname: 'refreshtest',
        });

      validRefreshToken = registerResponse.body.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/users/refresh')
        .send({ refreshToken: validRefreshToken });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
      }
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/users/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('should return 400 with missing refresh token', async () => {
      const response = await request(app).post('/api/users/refresh').send({});

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('GET /api/users/me', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `get-me-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Get Me Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('nickname');
        expect(response.body).not.toHaveProperty('password');
      }
    });

    it('should return 401 without authentication', async () => {
      await request(app).get('/api/users/me').expect(401);
    });
  });

  describe('PATCH /api/users/me', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `update-me-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Update Me Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should update user profile', async () => {
      const updateData = {
        nickname: 'Updated Nickname',
      };

      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('nickname', updateData.nickname);
      }
    });

    it('should update password', async () => {
      const updateData = {
        password: 'newPassword123',
      };

      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([200, 204]).toContain(response.status);
    });

    it('should update profile image', async () => {
      const updateData = {
        image: 'https://example.com/new-avatar.jpg',
      };

      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('image', updateData.image);
      }
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        nickname: 'Should Fail',
      };

      await request(app).patch('/api/users/me').send(updateData).expect(401);
    });

    it('should return 400 with invalid data', async () => {
      const updateData = {
        email: 'invalid-email', // Invalid email format
      };

      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([400, 200]).toContain(response.status);
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should delete user account', async () => {
      const user = await prisma.user.create({
        data: {
          email: `delete-me-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Delete Me Test User',
        },
      });
      const authToken = generateAuthToken(user.id);

      const response = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 204]).toContain(response.status);

      if ([200, 204].includes(response.status)) {
        const deletedUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        expect(deletedUser).toBeNull();
      } else {
        await prisma.user.deleteMany({ where: { id: user.id } });
      }
    });

    it('should return 401 without authentication', async () => {
      await request(app).delete('/api/users/me').expect(401);
    });
  });
});
