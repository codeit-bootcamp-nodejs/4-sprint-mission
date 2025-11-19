import './mock-modules.js';
import bcrypt from 'bcrypt';
import request from 'supertest';

import { prisma } from './prisma-mock.js';

export async function getPrismaMock() {
  return prisma;
}

export async function loginAndGetSession(
  app: import('express').Express,
  opts?: {
    loginPath?: string;
    username?: string;
    password?: string;
    userId?: number;
    seedDb?: boolean;
    resetBeforeSeed?: boolean;
  }
) {
  const {
    loginPath = '/users/login',
    username = 'u',
    password = 'pw',
    userId = 7,
    seedDb = false,
    resetBeforeSeed = false,
  } = opts ?? {};

  if (seedDb) {
    const { prismaReset, seedUsersWithHash } = await import('./prisma-mock.js');
    if (resetBeforeSeed) prismaReset();
    await seedUsersWithHash([
      { id: userId, username, email: 'u@ex.com', password },
    ]);
  }

  const prisma = await getPrismaMock();

  prisma.user.findUnique.mockResolvedValue({
    id: userId,
    username,
    email: 'u@ex.com',
    password: await bcrypt.hash(password, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
  });

  const res = await request(app)
    .post(loginPath)
    .send({ username, password })
    .expect(200);

  const setCookies = res.headers['set-cookie'] ?? [];
  const cookiePairs = (
    Array.isArray(setCookies) ? setCookies : [setCookies]
  ).map((c) => c.split(';')[0]);
  const accessToken = res.body?.accessToken as string | undefined;

  return { cookies: cookiePairs, accessToken, user: { id: userId, username } };
}
