import '../_helper/mock-modules.js';
import request from 'supertest';

import { prismaReset, seedArticles } from '../_helper/prisma-mock.js';
import { createTestApp } from '../_helper/test-app.js';
import { loginAndGetSession } from '../_helper/test-utils.js';

describe('[통합] 게시글 API (인증 필요)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prismaReset();
  });

  test('POST /articles → 201 (쿠키 필요)', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'N', content: 'd', tags: [], images: [] })
      .expect(201);

    const createdId = res.body?.data?.id ?? 2;
    const getRes = await request(app).get(`/articles/${createdId}`).expect(200);
    expect(getRes.body.data).toEqual(
      expect.objectContaining({ title: 'N', content: 'd' })
    );
  });

  test('POST /articles → 401 (토큰 없음)', async () => {
    await request(app)
      .post('/articles')
      .send({ title: 'N', content: 'd', tags: [], images: [] })
      .expect(401);
  });

  test('POST /articles → 400 (검증 실패: 빈 title)', async () => {
    const { accessToken } = await loginAndGetSession(app);
    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '', content: 'd', tags: [], images: [] })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringMatching('제목은 필수입니다.'),
      })
    );
  });

  test('PATCH /articles/:id → 200 (쿠키 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'N', userId: user.id }]);
    await request(app)
      .patch('/articles/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'N2', content: 'd2', tags: [], images: [] })
      .expect(200);

    const res = await request(app).get('/articles/1').expect(200);
    expect(res.body.data).toEqual(
      expect.objectContaining({ id: 1, title: 'N2', content: 'd2' })
    );
  });

  test('PATCH /articles/:id → 403 (소유자 아님)', async () => {
    prismaReset();
    seedArticles([{ id: 2, title: 'X', userId: 999 }]);
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    const res = await request(app)
      .patch('/articles/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'X2', content: 'd2', tags: [], images: [] })
      .expect(403);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringMatching('권한이 없습니다.'),
      })
    );
  });

  test('DELETE /articles/:id → 200 (쿠키 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'N', userId: user.id }]);

    await request(app)
      .delete('/articles/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('DELETE /articles/:id → 204 & 이후 조회 404', async () => {
    prismaReset();
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 3, title: 'T', userId: user.id }]);
    await request(app)
      .delete('/articles/3')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await request(app).get('/articles/3').expect(404);
  });

  test('POST/DELETE /articles/:id/like → 200 → 204', async () => {
    prismaReset();
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 10, title: 'L', userId: user.id }]);

    const likeRes = await request(app)
      .post('/articles/10/like')
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
      .delete('/articles/10/like')
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
