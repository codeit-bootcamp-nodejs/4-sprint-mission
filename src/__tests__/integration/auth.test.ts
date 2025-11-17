//src/__tests__/integration/auth.test.ts
import request from 'supertest';
import app from '../../app';
import { clearDatabase, prisma } from '../utils/test_helpers';

describe('Auth API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('새로운 사용자를 생성하고 토큰을 반환해야 함', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'newuser@test.com',
        nickname: '새유저',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('newuser@test.com');
    });

    it('중복된 이메일로 가입 시 409 에러를 반환해야 함', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'newuser@test.com',
        nickname: '첫번째유저',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/register').send({
        email: 'newuser@test.com',
        nickname: '다른유저',
        password: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('이미 존재하는 이메일입니다.');
    });

    it('필수 필드 누락 시 400 에러를 반환해야 함', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@test.com',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'loginuser@test.com',
        nickname: '로그인유저',
        password: 'password123',
      });
    });

    it('올바른 자격 증명으로 로그인 성공해야 함', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'loginuser@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('loginuser@test.com');
    });

    it('잘못된 비밀번호로 401 에러를 반환해야 함', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'loginuser@test.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
    });

    it('존재하지 않는 이메일로 401 에러를 반환해야 함', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
    });
  });
});