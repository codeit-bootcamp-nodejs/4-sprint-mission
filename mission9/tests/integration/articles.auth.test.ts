import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/appHelper';
import { cleanDatabase, disconnectDatabase } from '../helpers/dbHelper';
import { createTestUser, getAuthCookie } from '../helpers/authHelper';
import { createTestArticle } from '../helpers/fixtureHelper';

describe('게시글 API - 인증 엔드포인트', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /articles', () => {
    it('인증된 사용자가 새 게시글을 생성해야 함', async () => {
      const { accessToken } = await createTestUser();
      const articleData = {
        title: 'New Article',
        content: 'This is the article content',
        image: 'https://example.com/article-image.jpg',
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(articleData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(articleData.title);
      expect(response.body.content).toBe(articleData.content);
      expect(response.body.image).toBe(articleData.image);
    });

    it('이미지 없이 게시글을 생성해야 함', async () => {
      const { accessToken } = await createTestUser();
      const articleData = {
        title: 'New Article',
        content: 'This is the article content',
        image: null,
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(articleData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(articleData.title);
      expect(response.body.content).toBe(articleData.content);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const articleData = {
        title: 'New Article',
        content: 'Article content',
      };

      await request(app).post('/articles').send(articleData).expect(401);
    });

    it('필수 필드가 누락되었을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();
      const articleData = {
        title: 'New Article',
        // missing content
      };

      await request(app)
        .post('/articles')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(articleData)
        .expect(400);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('소유자가 인증되었을 때 게시글을 수정해야 함', async () => {
      const { user, accessToken } = await createTestUser();
      const article = await createTestArticle(user.id);

      const updateData = {
        title: 'Updated Article',
        content: 'Updated content',
      };

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(article.id);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it('제목만 수정해야 함', async () => {
      const { user, accessToken } = await createTestUser();
      const article = await createTestArticle(user.id, {
        title: 'Original Title',
        content: 'Original Content',
      });

      const updateData = {
        title: 'Updated Title Only',
      };

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe('Original Content');
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      const updateData = {
        title: 'Updated Article',
      };

      await request(app)
        .patch(`/articles/${article.id}`)
        .send(updateData)
        .expect(401);
    });

    it('사용자가 소유자가 아닐 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken: otherUserToken } = await createTestUser({
        email: 'other@example.com',
      });
      const article = await createTestArticle(owner.id);

      const updateData = {
        title: 'Updated Article',
      };

      await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(otherUserToken)])
        .send(updateData)
        .expect(403);
    });

    it('게시글이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      const updateData = {
        title: 'Updated Article',
      };

      await request(app)
        .patch('/articles/999999')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('소유자가 인증되었을 때 게시글을 삭제해야 함', async () => {
      const { user, accessToken } = await createTestUser();
      const article = await createTestArticle(user.id);

      await request(app)
        .delete(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(204);

      // Verify article is deleted
      await request(app).get(`/articles/${article.id}`).expect(404);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      await request(app).delete(`/articles/${article.id}`).expect(401);
    });

    it('사용자가 소유자가 아닐 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken: otherUserToken } = await createTestUser({
        email: 'other@example.com',
      });
      const article = await createTestArticle(owner.id);

      await request(app)
        .delete(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(otherUserToken)])
        .expect(403);
    });

    it('게시글이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      await request(app)
        .delete('/articles/999999')
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(404);
    });
  });

  describe('POST /articles/:id/likes', () => {
    it('인증되었을 때 게시글에 좋아요를 추가해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken } = await createTestUser({ email: 'user@example.com' });
      const article = await createTestArticle(owner.id);

      await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(201);

      // Verify like was added
      const response = await request(app)
        .get(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(200);

      expect(response.body.likeCount).toBe(1);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      await request(app).post(`/articles/${article.id}/likes`).expect(401);
    });

    it('게시글이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      await request(app)
        .post('/articles/999999/likes')
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(404);
    });

    it('이미 좋아요를 눌렀을 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken } = await createTestUser({ email: 'user@example.com' });
      const article = await createTestArticle(owner.id);

      // First like
      await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(201);

      // Try to like again
      await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(400);
    });
  });

  describe('DELETE /articles/:id/likes', () => {
    it('인증되었을 때 게시글에서 좋아요를 제거해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken } = await createTestUser({ email: 'user@example.com' });
      const article = await createTestArticle(owner.id);

      // First add like
      await request(app)
        .post(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(201);

      // Then remove like
      await request(app)
        .delete(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(204);

      // Verify like was removed
      const response = await request(app)
        .get(`/articles/${article.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(200);

      expect(response.body.likeCount).toBe(0);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const article = await createTestArticle(user.id);

      await request(app).delete(`/articles/${article.id}/likes`).expect(401);
    });

    it('좋아요가 존재하지 않을 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken } = await createTestUser({ email: 'user@example.com' });
      const article = await createTestArticle(owner.id);

      await request(app)
        .delete(`/articles/${article.id}/likes`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(400);
    });
  });
});
