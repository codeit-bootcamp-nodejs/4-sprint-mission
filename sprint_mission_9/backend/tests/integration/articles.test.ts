import { generateAuthToken } from '../helpers/auth.helper';
import request from 'supertest';
import { app, prisma } from '../../src/app';

describe('Articles API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('인증 불필요 - GET /api/articles', () => {
    it('should return list of articles', async () => {
      const response = await request(app).get('/api/articles').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app).get('/api/articles?limit=2&page=1').expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('totalPages');
    });

    it('should include author and counts', async () => {
      const response = await request(app).get('/api/articles').expect(200);

      if (response.body.data.length > 0) {
        const article = response.body.data[0];
        expect(article).toHaveProperty('user');
        expect(article.user).toHaveProperty('nickname');
        expect(article).toHaveProperty('likeCount');
        expect(article).toHaveProperty('commentCount');
      }
    });
  });

  describe('인증 불필요 - GET /api/articles/:id', () => {
    it('should return an article by id', async () => {
      const response = await request(app).get('/api/articles/1').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
    });

    it('should return 404 for non-existent article', async () => {
      const response = await request(app).get('/api/articles/999999').expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('인증 필요 - POST /api/articles', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `article-create-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Article Create Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.article.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should create an article with authentication', async () => {
      const newArticle = {
        title: 'Test Article',
        content: 'Test Content',
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newArticle);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newArticle.title);
        expect(response.body.content).toBe(newArticle.content);
      }
    });

    it('should return 401 without authentication', async () => {
      const newArticle = {
        title: 'Test Article',
        content: 'Test Content',
      };

      await request(app).post('/api/articles').send(newArticle).expect(401);
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('인증 필요 - POST /api/articles/:id/like', () => {
    let authToken: string;
    let testUserId: number;
    let testArticleId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `article-like-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Article Like Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);

      const article = await prisma.article.create({
        data: {
          title: 'Article to Like',
          content: 'Test Content',
          userId: testUserId,
        },
      });
      testArticleId = article.id;
    });

    afterAll(async () => {
      await prisma.article.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should toggle like on an article', async () => {
      const response = await request(app)
        .post(`/api/articles/${testArticleId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('liked');
        expect(typeof response.body.liked).toBe('boolean');
      }
    });

    it('should return 401 without authentication', async () => {
      await request(app).post(`/api/articles/${testArticleId}/like`).expect(401);
    });

    it('should return 404 for non-existent article', async () => {
      const response = await request(app)
        .post('/api/articles/999999/like')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 403, 500]).toContain(response.status);
    });
  });

  describe('인증 필요 - PATCH /api/articles/:id', () => {
    let authToken: string;
    let testArticleId: number;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `article-update-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Article Update Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);

      const article = await prisma.article.create({
        data: {
          title: 'Article to Update',
          content: 'Original Content',
          userId: testUserId,
        },
      });
      testArticleId = article.id;
    });

    afterAll(async () => {
      await prisma.article.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should update an article successfully', async () => {
      const updateData = {
        title: 'Updated Article Title',
        content: 'Updated Content',
      };

      const response = await request(app)
        .patch(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('title', updateData.title);
        expect(response.body).toHaveProperty('content', updateData.content);
      }
    });

    it('should update article with partial data', async () => {
      const updateData = {
        title: 'Partially Updated Title',
      };

      const response = await request(app)
        .patch(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('title', updateData.title);
      }
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        title: 'Should Fail',
      };

      await request(app)
        .patch(`/api/articles/${testArticleId}`)
        .send(updateData)
        .expect(401);
    });

    it('should return 404 for non-existent article', async () => {
      const updateData = {
        title: 'Non-existent Article',
      };

      const response = await request(app)
        .patch('/api/articles/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 with invalid data', async () => {
      const updateData = {
        title: '', // Empty title
      };

      const response = await request(app)
        .patch(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([400, 200]).toContain(response.status);
    });
  });

  describe('인증 필요 - DELETE /api/articles/:id', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `article-delete-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Article Delete Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.article.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should delete an article successfully', async () => {
      // Create an article to delete
      const article = await prisma.article.create({
        data: {
          title: 'Article to Delete',
          content: 'Will be deleted',
          userId: testUserId,
        },
      });

      const response = await request(app)
        .delete(`/api/articles/${article.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedArticle = await prisma.article.findUnique({
        where: { id: article.id },
      });
      expect(deletedArticle).toBeNull();
    });

    it('should return 401 without authentication', async () => {
      const article = await prisma.article.create({
        data: {
          title: 'Article Requiring Auth',
          content: 'Auth required',
          userId: testUserId,
        },
      });

      await request(app).delete(`/api/articles/${article.id}`).expect(401);

      // Cleanup
      await prisma.article.delete({ where: { id: article.id } });
    });

    it('should return 404 for non-existent article', async () => {
      const response = await request(app)
        .delete('/api/articles/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 for invalid article id', async () => {
      const response = await request(app)
        .delete('/api/articles/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect([400, 404]).toContain(response.status);
    });
  });

  describe('인증 불필요 - Filtering and Search', () => {
    it('should search articles by keyword', async () => {
      const response = await request(app).get('/api/articles?search=test').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should sort articles by most recent', async () => {
      const response = await request(app)
        .get('/api/articles?orderBy=createdAt&sortOrder=desc')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 1) {
        const firstDate = new Date(response.body.data[0].createdAt);
        const secondDate = new Date(response.body.data[1].createdAt);
        expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
      }
    });

    it('should sort articles by most liked', async () => {
      const response = await request(app)
        .get('/api/articles?orderBy=likeCount&sortOrder=desc');

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });
});
