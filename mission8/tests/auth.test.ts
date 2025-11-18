import request from 'supertest';

import app from '../src/app';
import prisma from '../src/utils/prisma';

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
});

test('회원가입 성공', async () => {
  const res = await request(app).post('/auth/register').send({
    email: 'user@test.com',
    password: 'password',
    username: 'test',
  });
  expect(res.status).toBe(201);
});

test('로그인 성공', async () => {
  const res = await request(app).post('/auth/login').send({
    email: 'user@test.com',
    password: 'password',
  });
  expect(res.status).toBe(200);
});
