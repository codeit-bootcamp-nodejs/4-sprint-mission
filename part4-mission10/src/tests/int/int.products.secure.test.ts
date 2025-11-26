import '../_helper/mock-modules.js';
import request from 'supertest';

import { prismaReset, seedProducts } from '../_helper/prisma-mock.js';
import { createTestApp } from '../_helper/test-app.js';
import { loginAndGetSession } from '../_helper/test-utils.js';

describe('[통합] 상품 API (인증 필요)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prismaReset();
  });

  test('POST /products → 201 (쿠키 필요)', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'N', description: 'd', price: 999, tags: [], images: [] })
      .expect(201);

    const createdId = res.body?.data?.id ?? 1;

    const getRes = await request(app).get(`/products/${createdId}`).expect(200);
    expect(getRes.body.data).toEqual(
      expect.objectContaining({ name: 'N', description: 'd' })
    );
  });

  test('POST /products → 401 (토큰 없음)', async () => {
    await request(app)
      .post('/products')
      .send({ name: 'N', description: 'd', price: 999, tags: [], images: [] })
      .expect(401);
  });

  test('POST /products → 400 (검증 실패: 빈 name)', async () => {
    const { accessToken } = await loginAndGetSession(app);

    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '', description: 'd', price: 999, tags: [], images: [] })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringMatching('상품 이름은 필수입니다.'),
      })
    );
  });

  test('PATCH /products/:id → 200 (쿠키 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([
      { id: 1, name: 'N', description: 'd', price: 1000, userId: user.id },
    ]);

    await request(app)
      .patch('/products/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'N2', description: 'd2', price: 888, tags: [], images: [] })
      .expect(200);

    const res = await request(app).get('/products/1').expect(200);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'N2',
        description: 'd2',
        price: 888,
      })
    );
  });

  test('PATCH /products/:id → 403 (소유자 아님)', async () => {
    prismaReset();
    seedProducts([
      { id: 2, name: 'X', description: 'd', price: 1000, userId: 999 },
    ]);
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    const res = await request(app)
      .patch('/products/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'X2', description: 'd2', price: 777, tags: [], images: [] })
      .expect(403);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringMatching('권한이 없습니다.'),
      })
    );
  });

  test('DELETE /products/:id → 204 (쿠키 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([
      { id: 1, name: 'N', description: 'd', price: 1000, userId: user.id },
    ]);

    await request(app)
      .delete('/products/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('DELETE /products/:id → 204 & 이후 조회 404', async () => {
    prismaReset();
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([
      { id: 3, name: 'T', description: 'd', price: 1000, userId: user.id },
    ]);

    await request(app)
      .delete('/products/3')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await request(app).get('/products/3').expect(404);
  });

  test('POST/DELETE /products/:id/like → 200 → 200', async () => {
    prismaReset();
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([
      { id: 10, name: 'L', description: 'd', price: 1000, userId: user.id },
    ]);

    const likeRes = await request(app)
      .post('/products/10/like')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(likeRes.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          message: expect.stringMatching(/완료|liked/i),
          likeCount: expect.any(Number),
        }),
      })
    );

    const unlikeRes = await request(app)
      .delete('/products/10/like')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(unlikeRes.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          message: expect.stringMatching(/취소|unliked/i),
          likeCount: expect.any(Number),
        }),
      })
    );
  });
});
