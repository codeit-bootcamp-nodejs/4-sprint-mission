import request from 'supertest';
import prisma from '@/lib/prisma.js';
import { redisClient } from '@/lib/redis.js';
import {
  REDIS_KEY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '@/lib/constants.js';
import jwt from 'jsonwebtoken';
import {
  mockAxiosGet,
  mockAxiosPost,
  mockGenerateAuthUrl,
  mockGetToken,
  mockVerifyIdToken,
} from '@/tests/mocks/oauth.js';
import { jest } from '@jest/globals';
import type { GenerateAuthUrlOpts } from 'google-auth-library';

describe('Auth API', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: any;
  const userData = {
    email: 'test1@test.com',
    nickname: 'testUser1',
    password: '12345678',
  };
  const loginData = {
    email: 'test1@test.com',
    password: '12345678',
  };
  const googleUserData = {
    nickname: 'google_1234',
    email: 'googleTest@google.com',
    authProvider: 'google',
    providerId: 'googleTest',
    profileImage: 'test.png',
  };
  const kakaoUserData = {
    nickname: 'kakao_1234',
    email: 'kakaoTest@naver.com',
    authProvider: 'kakao',
    providerId: 'kakaoTest',
    profileImage: 'test.png',
  };
  beforeAll(async () => {
    app = (await import('@/app.js')).app; // mock 적용 후 app 로딩
  });
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('POST /auth/signup', () => {
    it('유저 회원 가입', async () => {
      // when
      const response = await request(app).post('/auth/signup').send(userData);
      // then
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.authProvider).toBe('local');
      expect(response.body.password).not.toBeDefined();
    });
    it('유효하지 않은 값을 입력하면 400 에러 발생', async () => {
      // when
      const response = await request(app).post('/auth/signup').send({
        email: null,
      });
      // then
      expect(response.status).toBe(400);
    });
    it('중복된 이메일을 입력하면 409 에러 발생', async () => {
      // when
      const response1 = await request(app).post('/auth/signup').send(userData);
      const response2 = await request(app).post('/auth/signup').send(userData);
      // then
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(409);
    });
  });
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/signup').send(userData);
      await prisma.user.create({
        data: googleUserData,
      });
      await prisma.user.create({
        data: kakaoUserData,
      });
    });
    it('일반 로그인', async () => {
      // when
      const response = await request(app).post('/auth/login').send(loginData);
      // then
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });
    it('존재하지 않는 유저 이메일을 입력하면 401 에러 발생', async () => {
      // when
      const response = await request(app)
        .post('/auth/login')
        .send({
          ...loginData,
          email: 'test@test.com',
        });
      // then
      expect(response.status).toBe(401);
    });
    it('구글 로그인 유저가 일반 로그인을 시도하면 401 에러 발생', async () => {
      // when
      const response = await request(app)
        .post('/auth/login')
        .send({
          ...loginData,
          email: 'googleTest@google.com',
        });
      // then
      expect(response.status).toBe(401);
    });
    it('카카오 로그인 유저가 일반 로그인을 시도하면 401 에러 발생', async () => {
      // when
      const response = await request(app)
        .post('/auth/login')
        .send({
          ...loginData,
          email: 'kakaoTest@naver.com',
        });
      // then
      expect(response.status).toBe(401);
    });
    it('비밀번호가 틀리면 401 에러 발생', async () => {
      // when
      const response = await request(app)
        .post('/auth/login')
        .send({
          ...loginData,
          password: 'error test',
        });
      // then
      expect(response.status).toBe(401);
    });
  });
  describe('GET /auth/google', () => {
    it('구글 로그인 요청시 구글 로그인 페이지로 302 리다이렉트 되어야 한다.', async () => {
      // given
      mockGenerateAuthUrl.mockImplementation(
        ({
          access_type: _access_type,
          scope: _scope,
          state,
        }: GenerateAuthUrlOpts) => {
          return `https://mock.google.com/auth-url?state=${state}`;
        },
      );
      // when
      const response = await request(app).get(
        '/auth/google?redirectUrl=http://localhost',
      );
      // then
      expect(response.status).toBe(302);
      expect(mockGenerateAuthUrl).toHaveBeenCalled();

      const locationHeader = response.headers.location;
      expect(locationHeader).toBeDefined();

      const url = new URL(locationHeader);
      expect(url.searchParams.get('state')).toBe('http://localhost');
    });
  });
  describe('GET /auth/google/callback', () => {
    it('새로운 유저가 리다이렉트된 경우 로그인 정보를 토대로 새로운 유저를 생성한다.', async () => {
      // given
      mockGetToken.mockResolvedValue({
        tokens: { id_token: 'fake_google_id_token' },
      });
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: 'googleTest2',
          email: 'googleTest2@google.com',
          name: 'google_qwer',
          picture: 'http://profile.jpg',
        }),
      });
      // when
      const response = await request(app).get(
        '/auth/google/callback?code=fake_code&state=http://localhost:3000/home',
      );
      // then
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('http://localhost:3000/home');

      expect(response.headers.location).toContain('accessToken=');
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=');
      // 실제로 유저가 생성됐는지
      const newUser = await prisma.user.findUnique({
        where: { email: 'googleTest2@google.com' },
      });
      expect(newUser).toBeDefined();
      expect(newUser?.providerId).toBe('googleTest2');
      expect(newUser?.authProvider).toBe('google');
    });
    it('기존에 가입한 유저가 리다이렉트된 경우 새로 유저를 생성하지 않고 로그인(토큰 발급) 처리', async () => {
      // given
      const user1 = await prisma.user.create({
        data: {
          nickname: 'google_1234',
          email: 'googleTest@google.com',
          authProvider: 'google',
          providerId: 'googleTest',
          profileImage: 'test.png',
          refreshToken: 'old_refresh_token',
        },
      });
      mockGetToken.mockResolvedValue({
        tokens: { id_token: 'fake_google_id_token' },
      });

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: 'googleTest',
          email: 'googleTest@google.com',
          name: 'google_qwer',
          picture: 'http://profile.jpg',
        }),
      });
      // when
      const response = await request(app).get(
        '/auth/google/callback?code=fake_code&state=http://localhost:3000/home',
      );

      // then
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('http://localhost:3000/home');
      expect(response.headers.location).toContain('accessToken=');
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=');

      const userAfterLogin = await prisma.user.findUnique({
        where: { email: 'googleTest@google.com' },
      });
      expect(userAfterLogin).not.toBeNull();
      expect(userAfterLogin!.id).toBe(user1.id);
      expect(userAfterLogin!.refreshToken).not.toBe('old_refresh_token');
      expect(userAfterLogin!.refreshToken).toBeTruthy();
    });
    it('id 토큰 발급에 실패한 경우 400 에러 발생', async () => {
      // given
      mockGetToken.mockResolvedValue({
        tokens: {},
      });
      // when
      const response = await request(app).get(
        '/auth/google/callback?code=fake_code&state=http://localhost:3000/home',
      );
      // then
      expect(response.status).toBe(400);
    });
    it('토큰 payload가 유효하지않은 경우 400 에러 발생', async () => {
      // given
      mockGetToken.mockResolvedValue({
        tokens: { id_token: 'fake_google_id_token' },
      });

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => null,
      });
      // when
      const response = await request(app).get(
        '/auth/google/callback?code=fake_code&state=http://localhost:3000/home',
      );
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('GET /auth/kakao', () => {
    it('카카오 로그인 요청시 카카오 로그인 페이지로 302 리다이렉트 되어야 한다.', async () => {
      // when
      const response = await request(app).get(
        '/auth/kakao?redirectUrl=http://localhost',
      );

      // then
      expect(response.status).toBe(302);
      const locationHeader = response.headers.location;
      expect(locationHeader).toBeDefined();
      const url = new URL(locationHeader);
      expect(url.searchParams.get('state')).toBe('http://localhost');
    });
  });
  describe('GET /auth/kakao/callback', () => {
    it('새로운 유저가 리다이렉트된 경우 로그인 정보를 토대로 새로운 유저를 생성한다.', async () => {
      // given
      mockAxiosPost.mockResolvedValue({
        data: { access_token: 'fake_kakao_access_token' },
      });
      mockAxiosGet.mockResolvedValue({
        data: {
          id: 123456789,
          kakao_account: {
            email: 'kakaoTest2@naver.com',
            profile: {
              nickname: 'kakaoTest2',
              thumbnail_image_url: 'http://profile.jpg',
            },
          },
        },
      });
      // when
      const response = await request(app).get(
        '/auth/kakao/callback?code=fake_code&state=http://localhost:3000/home',
      );

      // then
      expect(response.status).toBe(302);
      const newUser = await prisma.user.findUnique({
        where: { email: 'kakaoTest2@naver.com' },
      });
      expect(newUser).toBeDefined();
      expect(newUser?.providerId).toBe('123456789');
    });
    it('기존에 가입한 유저가 리다이렉트된 경우 새로 유저를 생성하지 않고 로그인(토큰 발급) 처리', async () => {
      // given
      const user1 = await prisma.user.create({
        data: {
          nickname: 'kakao_1234',
          email: 'kakaoTest@naver.com',
          authProvider: 'kakao',
          providerId: '123456789',
          profileImage: 'test.png',
          refreshToken: 'old_refresh_token',
        },
      });
      mockAxiosPost.mockResolvedValue({
        data: { access_token: 'fake_kakao_access_token' },
      });
      mockAxiosGet.mockResolvedValue({
        data: {
          id: 123456789,
          kakao_account: {
            email: 'kakaoTest2@naver.com',
            profile: {
              nickname: 'kakaoTest2',
              thumbnail_image_url: 'http://profile.jpg',
            },
          },
        },
      });
      // when
      const response = await request(app).get(
        '/auth/kakao/callback?code=fake_code&state=http://localhost:3000/home',
      );

      // then
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('http://localhost:3000/home');
      expect(response.headers.location).toContain('accessToken=');
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=');

      const userAfterLogin = await prisma.user.findUnique({
        where: { email: 'kakaoTest@naver.com' },
      });
      expect(userAfterLogin).not.toBeNull();
      expect(userAfterLogin!.id).toBe(user1.id);
      expect(userAfterLogin!.refreshToken).not.toBe('old_refresh_token');
      expect(userAfterLogin!.refreshToken).toBeTruthy();
    });
    it('토큰 payload가 유효하지않은 경우 400 에러 발생', async () => {
      // given
      mockAxiosGet.mockResolvedValue({
        data: {
          id: 123456789,
          kakao_account: {
            email: null,
            profile: {
              nickname: null,
              thumbnail_image_url: 'http://profile.jpg',
            },
          },
        },
      });
      // when
      const response = await request(app).get(
        '/auth/kakao/callback?code=fake_code&state=http://localhost:3000/home',
      );
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('POST /auth/logout', () => {
    const userData = {
      email: 'test1@test.com',
      nickname: 'testUser1',
      password: '12345678',
    };
    const loginData = {
      email: 'test1@test.com',
      password: '12345678',
    };
    beforeEach(async () => {
      await request(app).post('/auth/signup').send(userData);
    });
    it('로그아웃 성공시 accessToken이 redis 블랙리스트에 등록되어야 한다.', async () => {
      // given
      const user = await request(app).post('/auth/login').send(loginData);
      const { accessToken } = user.body;
      // when
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('로그아웃 되었습니다.');

      const blacklisted = await redisClient.get(`${REDIS_KEY}:${accessToken}`);
      expect(blacklisted).toBe('blacklisted');
    });
    it('유효시간이 이미 지난 토큰으로 요청시 401 에러 발생', async () => {
      // given
      const expiredToken = jwt.sign({ userId: 1 }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '0s',
      });
      // when
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`);

      // then (검증)
      expect(response.status).toBe(401);
    });
  });
  describe('POST /auth/refresh', () => {
    beforeEach(async () => {
      await request(app).post('/auth/signup').send(userData);
    });
    it('리프레시 성공시 토큰을 재발급 하고 이전 refreshToken이 redis 블랙리스트에 등록되어야 한다.', async () => {
      // given
      const user = await request(app).post('/auth/login').send(loginData);
      const { accessToken, refreshToken } = user.body;

      // iat 변경을 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await request(app)
        .post('/auth/refresh')
        .set('x-refresh-token', `${refreshToken}`);

      // then
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      // 새 토큰은 옛날 토큰과 달라야 함
      expect(response.body.accessToken).not.toBe(accessToken);
      expect(response.body.refreshToken).not.toBe(refreshToken);

      // then
      const blacklisted = await redisClient.get(`${REDIS_KEY}:${refreshToken}`);
      expect(blacklisted).toBe('blacklisted');
    });
    it('만료된 리프레시 토큰으로 요청 시 401 에러 발생', async () => {
      // given
      const expiredToken = jwt.sign({ userId: 1 }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '0s',
      });
      // when
      const response = await request(app)
        .post('/auth/refresh')
        .set('x-refresh-token', `${expiredToken}`);

      // then
      expect(response.status).toBe(401);
    });
    it('유효하지않은 리프레시 토큰으로 요청 시 403 에러 발생', async () => {
      // when
      const response = await request(app).post('/auth/refresh');

      // then
      expect(response.status).toBe(401);
    });
    it('이미 한번 재발급받은 리프레시 토큰으로 또 요청시 401 에러 발생', async () => {
      // given
      const user = await request(app).post('/auth/login').send(loginData);
      const { refreshToken } = user.body;

      // when
      await request(app)
        .post('/auth/refresh')
        .set('x-refresh-token', `${refreshToken}`)
        .expect(200);

      const response = await request(app)
        .post('/auth/refresh')
        .set('x-refresh-token', `${refreshToken}`);

      expect(response.status).toBe(401);
    });
  });
});
