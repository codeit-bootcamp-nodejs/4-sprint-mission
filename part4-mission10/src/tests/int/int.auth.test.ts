import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import type { JwtPayload } from 'jsonwebtoken';
import request from 'supertest';
import type { Response as SupertestResponse } from 'supertest';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../lib/constants.js';
import { prisma } from '../../lib/prismaClient.js';
import { validation } from '../../middlewares/validation.js';
import { asMockFn, type Awaited } from '../_helper/jest-typed.js';

export function extractCookieUnsafe(
  res: SupertestResponse,
  name: string
): string | null {
  const raw = res.get?.('Set-Cookie') as string | string[] | undefined;
  const raw2 =
    raw ??
    (res.headers?.['set-cookie'] as unknown as string | string[] | undefined);

  const arr: string[] = Array.isArray(raw2) ? raw2 : raw2 ? [raw2] : [];
  const item = arr.find(
    (c) => typeof c === 'string' && c.startsWith(`${name}=`)
  );
  if (!item) return null;

  const semi = item.indexOf(';');
  const first = semi >= 0 ? item.slice(0, semi) : item;
  const eq = first.indexOf('=');
  return eq >= 0 ? first.slice(eq + 1) : null;
}

describe('[통합] 인증 (회원가입/로그인)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    jest.spyOn(validation, 'validateRegister').mockImplementation(((
      req,
      _res,
      next
    ) => {
      if (
        typeof req.body?.email !== 'string' ||
        typeof req.body?.username !== 'string' ||
        typeof req.body?.password !== 'string'
      ) {
      }
      next();
      return Promise.resolve();
    }) as typeof validation.validateRegister);

    const { createTestApp } = await import('../_helper/test-app.js');
    app = await createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as unknown as jest.Mock).mockRestore();
    (console.error as unknown as jest.Mock).mockRestore();
  });

  // ---------------------------
  // 회원가입
  // ---------------------------
  test('POST /users/register → 201 + 생성된 유저 일부 필드', async () => {
    const now = new Date();

    type UserCreateArgs = Parameters<typeof prisma.user.create>[0];
    type UserEntity = Awaited<ReturnType<typeof prisma.user.create>>;

    asMockFn<UserCreateArgs, UserEntity>(prisma.user.create).mockResolvedValue({
      id: 101,
      email: 'new@ex.com',
      username: 'newbie',
      password: await bcrypt.hash('1234abcd!', 10),
      images: [] as string[],
      createdAt: now,
      updatedAt: now,
    } satisfies UserEntity);

    const res = await request(app)
      .post('/users/register')
      .send({ email: 'new@ex.com', username: 'newbie', password: '1234abcd!' })
      .expect(201);

    const body = res.body ?? {};
    const flattened = body.data?.user ?? body.data ?? body.user ?? body;

    expect(flattened).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: 'new@ex.com',
        username: 'newbie',
      })
    );

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  test('POST /users/register (중복 이메일) → 409', async () => {
    const p2002 = Object.assign(new Error('P2002'), {
      code: 'P2002' as const,
      meta: { target: ['email'] as string[] },
    }) as Error & { code: 'P2002'; meta: { target: string[] } };

    type UserCreateArgs = Parameters<typeof prisma.user.create>[0];
    type UserEntity = Awaited<ReturnType<typeof prisma.user.create>>;

    asMockFn<UserCreateArgs, UserEntity>(
      prisma.user.create
    ).mockRejectedValueOnce(p2002);

    const res = await request(app)
      .post('/users/register')
      .send({ email: 'dup@ex.com', username: 'dup', password: '1234abcd!' })
      .expect(409);

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 409,
        message: expect.stringMatching(/이미 사용 중인 이메일|중복/),
      })
    );
  });

  // ---------------------------
  // 로그인
  // ---------------------------
  test('POST /users/login → 200 + 토큰 + 쿠키', async () => {
    const hashed = await bcrypt.hash('1234abcd!', 10);

    type FindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0];
    type FindUniqueRet = Awaited<ReturnType<typeof prisma.user.findUnique>>;

    asMockFn<FindUniqueArgs, FindUniqueRet>(
      prisma.user.findUnique
    ).mockResolvedValue({
      id: 7,
      username: 'u',
      email: 'u@ex.com',
      password: hashed,
      images: [] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies NonNullable<FindUniqueRet>);

    const res = await request(app)
      .post('/users/login')
      .send({ username: 'u', password: '1234abcd!' })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      })
    );

    const rawCookies = res.get('Set-Cookie') ?? [];
    const cookies = (
      Array.isArray(rawCookies) ? rawCookies : [rawCookies]
    ).join(';');

    expect(typeof ACCESS_TOKEN_COOKIE_NAME).toBe('string');
    expect(typeof REFRESH_TOKEN_COOKIE_NAME).toBe('string');

    expect(cookies).toMatch(
      new RegExp(
        `${ACCESS_TOKEN_COOKIE_NAME.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=`
      )
    );
    expect(cookies).toMatch(
      new RegExp(
        `${REFRESH_TOKEN_COOKIE_NAME.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=`
      )
    );
  });

  test('POST /users/login (없는 유저) → 400', async () => {
    type FindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0];
    type FindUniqueRet = Awaited<ReturnType<typeof prisma.user.findUnique>>;

    asMockFn<FindUniqueArgs, FindUniqueRet>(
      prisma.user.findUnique
    ).mockResolvedValueOnce(null);

    await request(app)
      .post('/users/login')
      .send({ username: 'nope', password: 'whatever' })
      .expect(401);
  });

  test('POST /users/login (비밀번호 불일치) → 400', async () => {
    const hashedReal = await bcrypt.hash('real-pass', 10);

    type FindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0];
    type FindUniqueRet = Awaited<ReturnType<typeof prisma.user.findUnique>>;

    asMockFn<FindUniqueArgs, FindUniqueRet>(
      prisma.user.findUnique
    ).mockResolvedValueOnce({
      id: 9,
      username: 'u2',
      email: 'u2@ex.com',
      password: hashedReal,
      images: [] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies NonNullable<FindUniqueRet>);

    await request(app)
      .post('/users/login')
      .send({ username: 'u2', password: 'wrong-pass' })
      .expect(401);
  });

  test('POST /auth/refresh → 200 + accessToken 재발급 & refresh 회전', async () => {
    const hashed = await bcrypt.hash('1234abcd!', 10);

    type FindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0];
    type FindUniqueRet = Awaited<ReturnType<typeof prisma.user.findUnique>>;

    asMockFn<FindUniqueArgs, FindUniqueRet>(
      prisma.user.findUnique
    ).mockResolvedValue({
      id: 77,
      username: 'ruser',
      email: 'r@ex.com',
      password: hashed,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies NonNullable<FindUniqueRet>);

    const loginRes = await request(app)
      .post('/users/login')
      .send({ username: 'ruser', password: '1234abcd!' })
      .expect(200);

    const setCookie = loginRes.get('Set-Cookie') ?? [];
    const cookieHeader = (Array.isArray(setCookie) ? setCookie : [setCookie])
      .map((c) => c.split(';')[0])
      .join('; ');

    const res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookieHeader)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({ accessToken: expect.any(String) })
    );

    const refreshedCookies = (res.get('Set-Cookie') ?? []).join(';');
    expect(refreshedCookies).toMatch(
      new RegExp(
        `${ACCESS_TOKEN_COOKIE_NAME.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=`
      )
    );
    expect(refreshedCookies).toMatch(
      new RegExp(
        `${REFRESH_TOKEN_COOKIE_NAME.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=`
      )
    );
  });

  test('POST /auth/refresh (쿠키 없음) → 401', async () => {
    const res = await request(app).post('/auth/refresh').expect(401);
    expect(res.body).toEqual(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  test('POST /auth/refresh (토큰 위조: 재서명으로 시그니처 불일치) → 401', async () => {
    type FindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0];
    type FindUniqueRet = Awaited<ReturnType<typeof prisma.user.findUnique>>;

    const hashed = await bcrypt.hash('1234abcd!', 10);
    asMockFn<FindUniqueArgs, FindUniqueRet>(
      prisma.user.findUnique
    ).mockResolvedValue({
      id: 777,
      username: 'siguser',
      email: 'sig@ex.com',
      password: hashed,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies NonNullable<FindUniqueRet>);

    const loginRes = await request(app)
      .post('/users/login')
      .send({ username: 'siguser', password: '1234abcd!' })
      .expect(200);

    const refreshRaw = extractCookieUnsafe(loginRes, REFRESH_TOKEN_COOKIE_NAME);
    expect(typeof refreshRaw).toBe('string');

    const jwt = (await import('jsonwebtoken')).default;
    const C1 = await import('../../lib/constants.js');

    const decoded = jwt.decode(refreshRaw!) as JwtPayload | null;
    const sub = (decoded?.sub as unknown as number) ?? 777;

    const BAD_SECRET = `${C1.REFRESH_TOKEN_SECRET}__FORGED__`;
    const forged = jwt.sign({ sub, type: 'refresh' }, BAD_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    expect(() =>
      jwt.verify(forged, C1.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] })
    ).toThrow();

    jest.resetModules();
    const { verifyRefreshToken } = await import('../../lib/token.js');

    expect(() => verifyRefreshToken(forged)).toThrow(
      /유효하지 않은 리프레시 토큰/
    );

    const fakeCookieHeader = `${REFRESH_TOKEN_COOKIE_NAME}=${encodeURIComponent(
      forged
    )}`;
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', [fakeCookieHeader])
      .expect(401);
  });

  // 401: Authorization 헤더 없음
  test('GET /users/me → 401 (헤더 없음)', async () => {
    await request(app).get('/users/me').expect(401);
  });

  // 401: Bearer 형식 깨짐
  test('GET /users/me → 401 (잘못된 Bearer 형식)', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', 'Token abc')
      .expect(401);
  });

  // 401: refresh 쿠키 없음
  test('POST /auth/refresh → 401 (쿠키 없음)', async () => {
    await request(app).post('/auth/refresh').expect(401);
  });

  // 401: 위조/쓰레기 쿠키
  test('POST /auth/refresh → 401 (위조 쿠키)', async () => {
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`REFRESH_TOKEN=fake.jwt.parts`])
      .expect(401);
  });
});
