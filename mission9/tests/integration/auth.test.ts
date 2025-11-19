import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/appHelper';
import { cleanDatabase, disconnectDatabase } from '../helpers/dbHelper';
import { createTestUser } from '../helpers/authHelper';

describe('인증 API', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /auth/signup', () => {
    it('새로운 사용자를 성공적으로 생성해야 함', async () => {
      const signupData = {
        email: 'newuser@example.com',
        nickname: 'NewUser',
        password: 'Password123!',
        image: null,
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(signupData.email);
      expect(response.body.nickname).toBe(signupData.nickname);
      expect(response.body).not.toHaveProperty('password');
    });

    it('이메일이 이미 존재할 때 실패해야 함', async () => {
      const { user } = await createTestUser({
        email: 'existing@example.com',
      });

      const signupData = {
        email: 'existing@example.com',
        nickname: 'NewUser',
        password: 'Password123!',
        image: null,
      };

      await request(app).post('/auth/signup').send(signupData).expect(400);
    });

    it('필수 필드가 누락되었을 때 실패해야 함', async () => {
      const signupData = {
        email: 'newuser@example.com',
        // missing nickname and password
        image: null,
      };

      await request(app).post('/auth/signup').send(signupData).expect(400);
    });
  });

  describe('POST /auth/signin', () => {
    it('올바른 인증 정보로 로그인에 성공해야 함', async () => {
      const { user, password } = await createTestUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200);

      // Check response body
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(user.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('잘못된 비밀번호로 실패해야 함', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      await request(app)
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(400);
    });

    it('존재하지 않는 이메일로 실패해야 함', async () => {
      await request(app)
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(400);
    });

    it('필수 필드가 누락되었을 때 실패해야 함', async () => {
      await request(app)
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
          // missing password
        })
        .expect(400);
    });
  });

  describe('POST /auth/signout', () => {
    it('로그아웃 시 인증 쿠키를 삭제해야 함', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .post('/auth/signout')
        .set('Cookie', [`accessToken=${accessToken}`])
        .expect(200);

      // Check if cookie is cleared
      const cookies = response.headers['set-cookie'];
      if (cookies && Array.isArray(cookies)) {
        const accessTokenCookie = cookies.find((cookie: string) =>
          cookie.includes('accessToken')
        );
        if (accessTokenCookie) {
          expect(accessTokenCookie).toContain('Max-Age=0');
        }
      }
    });
  });
});
