// src/tests/auth.localStrategy.int.test.ts
import bcrypt from 'bcrypt';
import request from 'supertest';

import { localStrategy } from '../../src/lib/passport/localStrategy.js';
import { prisma } from '../../src/lib/prismaClient.js';
import { createPassportTestApp } from '../_helper/test-passport-app.js';

type Done = (err: unknown, user?: unknown, info?: unknown) => void;
type VerifyFn = (
  username: string,
  password: string,
  done: Done
) => void | Promise<void>;

describe('passport-local (비밀번호 검증)', () => {
  const app = createPassportTestApp();
  const verify: VerifyFn = (localStrategy as unknown as { _verify: VerifyFn })
    ._verify;
  test('localStrategy: 유저 없음 → 실패', async () => {
    // prisma.user.findUnique 가 null 반환하도록 모킹
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    const done = jest.fn();
    await verify('nouser', 'pw', done);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  test('localStrategy: 비밀번호 불일치 → 실패', async () => {
    const hashed = await bcrypt.hash('right', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      username: 'u',
      email: 'e',
      password: hashed,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const done = jest.fn();
    await verify('u', 'wrong', done);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  test('비번이 맞으면 200', async () => {
    const hashed = await bcrypt.hash('1234abcd!', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 7,
      username: 'u',
      email: 'u@ex.com',
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
    });

    await request(app)
      .post('/login')
      .send({ username: 'u', password: '1234abcd!' })
      .expect(200);
  });

  test('비번이 틀리면 401', async () => {
    const hashed = await bcrypt.hash('1234abcd!', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 7,
      username: 'u',
      email: 'u@ex.com',
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
    });

    await request(app)
      .post('/login')
      .send({ username: 'u', password: 'wrong!' })
      .expect(401);
  });
});
