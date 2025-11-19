import request from 'supertest';

import {
  prismaReset,
  seedArticles,
  seedArticleLikes,
  seedCommentLikes,
} from '../_helper/prisma-mock.js';
import { createTestApp } from '../_helper/test-app.js';

describe('[통합] 게시글 API (비인증)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    prismaReset();
    seedArticles([
      { id: 21, title: 'B', userId: 101, images: ['b1.png'], tags: [] },
      { id: 22, title: 'C', userId: 101, images: ['c1.png'], tags: [] },
    ]);
    seedArticleLikes([
      { articleId: 21, userId: 1 },
      { articleId: 21, userId: 2 },
    ]);
    seedCommentLikes([{ commentId: 100, userId: 1 }]);
  });

  test('GET /articles?query=__not_exists__ → 200 []', async () => {
    const app = await createTestApp();
    seedArticles([{ id: 1, title: 'Foo', userId: 1 }]);
    const res = await request(app)
      .get('/articles?query=__not_exists__')
      .expect(200);
    expect(res.body.data.length).toBe(0);
  });

  test('GET /articles → 200 + 목록', async () => {
    const res = await request(app)
      .get('/articles')
      .query({ page: 1, pageSize: 10 })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 21, title: 'B' }),
          expect.objectContaining({ id: 22, title: 'C' }),
        ]),
      })
    );
  });

  test('GET /articles/:id → 200 + 단건', async () => {
    const res = await request(app).get('/articles/21').expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ id: 21, title: 'B' }),
      })
    );
  });

  test('GET /articles/404 → 404', async () => {
    await request(app).get('/articles/404').expect(404);
  });
});
