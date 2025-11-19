import request from 'supertest';
import { app, prisma } from '../../src/app';
import { generateAuthToken } from '../helpers/auth.helper';

describe('Comments API', () => {
  let testUserId: number;
  let testProductId: number;
  let testArticleId: number;
  let testCommentId: number;
  let authToken: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-comments-${Date.now()}@example.com`,
        password: 'hashedpassword',
        nickname: 'Test Comments User',
      },
    });
    testUserId = user.id;
    authToken = generateAuthToken(testUserId);

    const product = await prisma.product.create({
      data: {
        name: 'Test Product for Comments',
        description: 'Test Description',
        price: 10000,
        userId: testUserId,
      },
    });
    testProductId = product.id;

    const article = await prisma.article.create({
      data: {
        title: 'Test Article for Comments',
        content: 'Test Content',
        userId: testUserId,
      },
    });
    testArticleId = article.id;
  });

  afterAll(async () => {
    await prisma.comment.deleteMany({ where: { userId: testUserId } });
    await prisma.article.deleteMany({ where: { id: testArticleId } });
    await prisma.product.deleteMany({ where: { id: testProductId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('Public - GET /api/comments', () => {
    beforeAll(async () => {
      await prisma.comment.create({
        data: {
          content: 'Test comment on product',
          userId: testUserId,
          productId: testProductId,
        },
      });
      await prisma.comment.create({
        data: {
          content: 'Test comment on article',
          userId: testUserId,
          articleId: testArticleId,
        },
      });
    });

    it('should return list of comments with pagination', async () => {
      const response = await request(app).get('/api/comments').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
    });

    it('should filter comments by productId', async () => {
      const response = await request(app)
        .get(`/api/comments?productId=${testProductId}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      if (response.body.data.length > 0) {
        const productComments = response.body.data.filter((c: { productId: number }) => c.productId === testProductId);
        expect(productComments.length).toBeGreaterThan(0);
      }
    });

    it('should filter comments by articleId', async () => {
      const response = await request(app)
        .get(`/api/comments?articleId=${testArticleId}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      if (response.body.data.length > 0) {
        const articleComments = response.body.data.filter((c: { articleId: number }) => c.articleId === testArticleId);
        expect(articleComments.length).toBeGreaterThan(0);
      }
    });

    it('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/comments?page=1&limit=5')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
    });

    it('should include user info in comments', async () => {
      const response = await request(app).get('/api/comments').expect(200);

      if (response.body.data.length > 0) {
        const comment = response.body.data[0];
        expect(comment).toHaveProperty('user');
        expect(comment.user).toHaveProperty('id');
        expect(comment.user).toHaveProperty('nickname');
      }
    });
  });

  describe('Public - GET /api/comments/:id', () => {
    beforeAll(async () => {
      const comment = await prisma.comment.create({
        data: {
          content: 'Test comment for get by id',
          userId: testUserId,
          productId: testProductId,
        },
      });
      testCommentId = comment.id;
    });

    it('should return a comment by id', async () => {
      const response = await request(app)
        .get(`/api/comments/${testCommentId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testCommentId);
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 404 for non-existent comment', async () => {
      const response = await request(app)
        .get('/api/comments/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Comment not found');
    });

    it('should return 400 for invalid comment id', async () => {
      const response = await request(app)
        .get('/api/comments/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid comment ID');
    });
  });

  describe('Protected - POST /api/comments', () => {
    it('should create a comment on a product with authentication', async () => {
      const newComment = {
        content: 'This is a test comment on product',
        productId: testProductId,
      };

      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newComment)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content', newComment.content);
      expect(response.body).toHaveProperty('productId', testProductId);
      expect(response.body).toHaveProperty('user');
    });

    it('should create a comment on an article with authentication', async () => {
      const newComment = {
        content: 'This is a test comment on article',
        articleId: testArticleId,
      };

      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newComment)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content', newComment.content);
      expect(response.body).toHaveProperty('articleId', testArticleId);
    });

    it('should return 401 without authentication', async () => {
      const newComment = {
        content: 'This should fail',
        productId: testProductId,
      };

      await request(app).post('/api/comments').send(newComment).expect(401);
    });

    it('should return 400 with missing content', async () => {
      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 without productId or articleId', async () => {
      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test comment' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Protected - PATCH /api/comments/:id', () => {
    let ownCommentId: number;
    let otherUserId: number;
    let otherCommentId: number;

    beforeAll(async () => {
      // Create comment owned by test user
      const ownComment = await prisma.comment.create({
        data: {
          content: 'My own comment to update',
          userId: testUserId,
          productId: testProductId,
        },
      });
      ownCommentId = ownComment.id;

      // Create another user and their comment
      const otherUser = await prisma.user.create({
        data: {
          email: `other-user-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Other User',
        },
      });
      otherUserId = otherUser.id;

      const otherComment = await prisma.comment.create({
        data: {
          content: 'Other user comment',
          userId: otherUserId,
          productId: testProductId,
        },
      });
      otherCommentId = otherComment.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { userId: otherUserId } });
      await prisma.user.deleteMany({ where: { id: otherUserId } });
    });

    it('should update own comment successfully', async () => {
      const updateData = {
        content: 'Updated comment content',
      };

      const response = await request(app)
        .patch(`/api/comments/${ownCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', ownCommentId);
      expect(response.body).toHaveProperty('content', updateData.content);
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        content: 'This should fail',
      };

      await request(app)
        .patch(`/api/comments/${ownCommentId}`)
        .send(updateData)
        .expect(401);
    });

    it('should return 403 when updating other user comment', async () => {
      const updateData = {
        content: 'Trying to update other user comment',
      };

      const response = await request(app)
        .patch(`/api/comments/${otherCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('권한이 없습니다');
    });

    it('should return 404 for non-existent comment', async () => {
      const updateData = {
        content: 'Update non-existent',
      };

      const response = await request(app)
        .patch('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 for invalid comment id', async () => {
      const updateData = {
        content: 'Update invalid',
      };

      const response = await request(app)
        .patch('/api/comments/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid comment ID');
    });

    it('should return 400 with invalid update data', async () => {
      const response = await request(app)
        .patch(`/api/comments/${ownCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Protected - DELETE /api/comments/:id', () => {
    let deleteCommentId: number;
    let otherUserId: number;
    let otherCommentId: number;

    beforeAll(async () => {
      // Create comment owned by test user
      const comment = await prisma.comment.create({
        data: {
          content: 'Comment to delete',
          userId: testUserId,
          productId: testProductId,
        },
      });
      deleteCommentId = comment.id;

      // Create another user and their comment
      const otherUser = await prisma.user.create({
        data: {
          email: `delete-other-user-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Delete Other User',
        },
      });
      otherUserId = otherUser.id;

      const otherComment = await prisma.comment.create({
        data: {
          content: 'Other user comment to delete',
          userId: otherUserId,
          productId: testProductId,
        },
      });
      otherCommentId = otherComment.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { userId: otherUserId } });
      await prisma.user.deleteMany({ where: { id: otherUserId } });
    });

    it('should delete own comment successfully', async () => {
      await request(app)
        .delete(`/api/comments/${deleteCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deletion
      const deletedComment = await prisma.comment.findUnique({
        where: { id: deleteCommentId },
      });
      expect(deletedComment).toBeNull();
    });

    it('should return 401 without authentication', async () => {
      await request(app).delete(`/api/comments/${otherCommentId}`).expect(401);
    });

    it('should return 403 when deleting other user comment', async () => {
      const response = await request(app)
        .delete(`/api/comments/${otherCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('권한이 없습니다');
    });

    it('should return 404 for non-existent comment', async () => {
      const response = await request(app)
        .delete('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 for invalid comment id', async () => {
      const response = await request(app)
        .delete('/api/comments/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid comment ID');
    });
  });
});
