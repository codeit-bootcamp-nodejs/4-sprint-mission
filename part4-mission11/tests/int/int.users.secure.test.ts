// src/tests/int.users.secure.test.ts
import { jest } from '@jest/globals';
import request from 'supertest';

import {
  prismaReset,
  seedArticles,
  seedCommentLikes,
  seedComments,
  seedProductLikes,
  seedProducts,
  seedUsersWithHash,
} from '../_helper/prisma-mock.js';
import { createTestApp } from '../_helper/test-app.js';
import { loginAndGetSession } from '../_helper/test-utils.js';

describe('[통합] 유저 API (인증 필요)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaReset();
    await seedUsersWithHash([
      { id: 7, username: 'u', email: 'u@ex.com', password: 'pw' },
    ]);
  });

  // ----------------------------
  // 프로필 수정 (PATCH /users/:userId)
  // ----------------------------
  test('PATCH /users/:id → 200 (소유자)', async () => {
    const { accessToken, user } = await loginAndGetSession(app, { userId: 7 });
    const res = await request(app)
      .patch('/users/7')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ id: user.id, username: 'u', email: 'u@ex.com', images: [] })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        updated: expect.objectContaining({
          id: 7,
          username: 'u',
          email: 'u@ex.com',
          images: [],
        }),
        message: '프로필 수정 완료!',
      })
    );
  });

  test('PATCH /users/:id → 403 (비소유자)', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 8 });
    await request(app)
      .patch('/users/7')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ username: 'hack' })
      .expect(403);
  });

  // ----------------------------
  // 비밀번호 변경 (PATCH /users/:userId/password)
  // ----------------------------
  test('PATCH /users/:id/password → 400 (새 비번 불일치)', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });
    const res = await request(app)
      .patch('/users/7/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pw',
        newPassword: 'n1',
        newPasswordConfirm: 'n2',
      })
      .expect(400);

    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toEqual(
      expect.stringMatching(/(일치하지 않습니다|불일치|mismatch|confirm)/i)
    );
  });

  test('PATCH /users/:id/password → 200 (소유자)', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });
    const res = await request(app)
      .patch('/users/7/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pw',
        newPassword: 'NewPass123!',
        newPasswordConfirm: 'NewPass123!',
      })
      .expect(200);

    expect(res.body).toEqual({ message: '비밀번호가 변경되었습니다.' });
  });

  // ----------------------------
  // 내가 단 댓글 (GET /users/:userId/my-comments)
  // ----------------------------
  test('GET /users/:id/my-comments → 200 + {comments}', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    // 시드
    seedArticles([{ id: 101, title: 't1', userId: 7 }]);
    seedProducts([{ id: 202, name: 'p1', userId: 7, price: 1000 }]);
    seedComments([
      { id: 1, userId: 7, content: 'hi', articleId: 101 },
      { id: 2, userId: 7, content: 'hello', productId: 202 },
    ]);
    seedCommentLikes([
      { commentId: 2, userId: 100 },
      { commentId: 2, userId: 101 },
      { commentId: 2, userId: 102 },
    ]);

    const res = await request(app)
      .get('/users/7/my-comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          content: 'hi',
          userId: 7,
          articleId: 101,
          productId: null,
          likeCount: expect.any(Number),
        }),
        expect.objectContaining({
          id: 2,
          content: 'hello',
          userId: 7,
          articleId: null,
          productId: 202,
          likeCount: 3,
        }),
      ])
    );
  });

  // ----------------------------
  // 좋아요한 목록들
  // ----------------------------
  test('GET /users/:id/likes/products → 200 + {data}', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    seedProducts([{ id: 10, name: 'Prod10', userId: 99, price: 1000 }]);
    seedProductLikes([{ productId: 10, userId: 7 }]);

    const res = await request(app)
      .get('/users/7/likes/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 10, name: 'Prod10' }),
      ])
    );
  });

  test('GET /users/:id/likes/comments → 200 + {data}', async () => {
    const { accessToken } = await loginAndGetSession(app, { userId: 7 });

    seedArticles([{ id: 20, title: 'A20', userId: 88 }]);
    seedComments([{ id: 30, userId: 55, content: 'nice', articleId: 20 }]);
    seedCommentLikes([{ commentId: 30, userId: 7 }]);

    const res = await request(app)
      .get('/users/7/likes/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 30,
          content: 'nice',
        }),
      ])
    );
  });
});
