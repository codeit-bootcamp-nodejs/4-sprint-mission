import request from 'supertest';

import {
  prismaReset,
  seedArticles,
  seedProducts,
  seedComments,
} from '../_helper/prisma-mock.js';
import { createTestApp } from '../_helper/test-app.js';
import { loginAndGetSession } from '../_helper/test-utils.js';

/* -----------------------------
 * 타입: API 응답 & DTO
 * --------------------------- */
type CommentDTO = {
  id: number;
  content: string;
  // 필요시 확장: userId, articleId/productId 등
};

type ApiData<T> = { data: T };
type ApiList<T> = { data: T[] };

const asBody = <T>(res: request.Response): T => res.body as unknown as T;

describe('[통합] 게시글 댓글 API (인증 필요)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });
  beforeEach(() => {
    prismaReset();
  });

  test('GET /articles/:articleId/comments → 200 (토큰 필요) + 목록', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'A', userId: user.id }]);
    seedComments([{ id: 101, articleId: 1, userId: user.id, content: 'c' }]);

    const res = await request(app)
      .get('/articles/1/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = asBody<ApiList<CommentDTO>>(res);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: expect.any(String),
      })
    );
  });

  test('GET /articles/:articleId/comments → 200 (토큰 없음, 비로그인)', async () => {
    seedArticles([{ id: 1, title: 'A', userId: 7 }]);
    await request(app).get('/articles/1/comments').expect(200);
  });

  test('POST /articles/:articleId/comments → 201 (토큰 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'A', userId: user.id }]);

    const res = await request(app)
      .post('/articles/1/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'hello' })
      .expect(201);

    const body = asBody<ApiData<CommentDTO>>(res);
    expect(body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: 'hello',
      })
    );
  });

  test('POST /articles/:id/comments → 401 (토큰 없음)', async () => {
    const app = await createTestApp();
    seedArticles([{ id: 1, title: 'A', userId: 7 }]);
    await request(app)
      .post('/articles/1/comments')
      .send({ content: 'x' })
      .expect(401);
  });

  test('PATCH /comments/:commentId → 200 (소유자) / 403 (비소유자)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'A', userId: user.id }]);
    const [c] = seedComments([
      { id: 201, articleId: 1, userId: user.id, content: 'old' },
    ]);
    if (!c) throw new Error('seedComments failed');
    const cId = c.id;

    await request(app)
      .patch(`/articles/comments/${cId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'new' })
      .expect(200);

    const { accessToken: other } = await loginAndGetSession(app, {
      userId: 999,
    });
    await request(app)
      .patch(`/articles/comments/${cId}`)
      .set('Authorization', `Bearer ${other}`)
      .send({ content: 'hack' })
      .expect(403);
  });

  test('POST/DELETE /comments/:id/like → 200 → (200 or 204)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedArticles([{ id: 1, title: 'A', userId: user.id }]);
    const [c] = seedComments([
      { id: 301, articleId: 1, userId: user.id, content: 'c' },
    ]);
    if (!c) throw new Error('seedComments failed');
    const cId = c.id;

    const likeRes = await request(app)
      .post(`/articles/comments/${cId}/like`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const likeBody =
      asBody<ApiData<{ message: string; likeCount: number }>>(likeRes);
    expect(likeBody.data.message).toEqual(expect.stringMatching(/완료|liked/i));
    expect(typeof likeBody.data.likeCount).toBe('number');

    const unlikeRes = await request(app)
      .delete(`/articles/comments/${cId}/like`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((res) => {
        if (![200, 204].includes(res.status)) {
          throw new Error(`expected 200 or 204, got ${res.status}`);
        }
      });

    if (unlikeRes.status === 200) {
      const unlikeBody =
        asBody<ApiData<{ message: string; likeCount: number }>>(unlikeRes);
      expect(unlikeBody.data.message).toEqual(
        expect.stringMatching(/취소|unliked/i)
      );
      expect(typeof unlikeBody.data.likeCount).toBe('number');
    }
  });
});

describe('[통합] 상품 댓글 API (인증 필요)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });
  beforeEach(() => {
    prismaReset();
  });

  test('GET /products/:productId/comments → 200 (토큰 필요) + 목록', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([{ id: 1, name: 'A', price: 111, userId: user.id }]);
    seedComments([{ id: 101, productId: 1, userId: user.id, content: 'c' }]);

    const res = await request(app)
      .get('/products/1/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = asBody<ApiList<CommentDTO>>(res);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: expect.any(String),
      })
    );
  });

  test('GET /products/:productId/comments → 200 (토큰 없음, 비로그인)', async () => {
    seedProducts([{ id: 1, name: 'A', price: 111, userId: 7 }]);
    await request(app).get('/products/1/comments').expect(200);
  });

  test('POST /products/:productId/comments → 201 (토큰 필요)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([{ id: 1, name: 'A', price: 111, userId: user.id }]);

    const res = await request(app)
      .post('/products/1/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'hello' })
      .expect(201);

    const body = asBody<ApiData<CommentDTO>>(res);
    expect(body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: 'hello',
      })
    );
  });

  test('PATCH /comments/:commentId → 200 (소유자) / 403 (비소유자)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([{ id: 1, name: 'A', price: 111, userId: user.id }]);
    const [c] = seedComments([
      { id: 201, productId: 1, userId: user.id, content: 'old' },
    ]);
    if (!c) throw new Error('seedComments failed');
    const cId = c.id;

    await request(app)
      .patch(`/products/comments/${cId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'new' })
      .expect(200);

    const { accessToken: other } = await loginAndGetSession(app, {
      userId: 999,
    });
    await request(app)
      .patch(`/products/comments/${cId}`)
      .set('Authorization', `Bearer ${other}`)
      .send({ content: 'hack' })
      .expect(403);
  });

  test('POST/DELETE /comments/:id/like → 200 → (200 or 204)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    seedProducts([{ id: 1, name: 'A', price: 111, userId: user.id }]);
    const [c] = seedComments([
      { id: 301, productId: 1, userId: user.id, content: 'c' },
    ]);
    if (!c) throw new Error('seedComments failed');
    const cId = c.id;

    const likeRes = await request(app)
      .post(`/products/comments/${cId}/like`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const likeBody =
      asBody<ApiData<{ message: string; likeCount: number }>>(likeRes);
    expect(likeBody.data.message).toEqual(expect.stringMatching(/완료|liked/i));
    expect(typeof likeBody.data.likeCount).toBe('number');

    const unlikeRes = await request(app)
      .delete(`/products/comments/${cId}/like`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((res) => {
        if (![200, 204].includes(res.status)) {
          throw new Error(`expected 200 or 204, got ${res.status}`);
        }
      });

    if (unlikeRes.status === 200) {
      const unlikeBody =
        asBody<ApiData<{ message: string; likeCount: number }>>(unlikeRes);
      expect(unlikeBody.data.message).toEqual(
        expect.stringMatching(/취소|unliked/i)
      );
      expect(typeof unlikeBody.data.likeCount).toBe('number');
    }
  });
});
