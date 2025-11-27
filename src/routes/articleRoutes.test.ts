import request from 'supertest';
import app from '../app';
import { prisma } from '../utils/prisma';
import { clearDatabase } from '../utils/testUtils';

describe('Article API Integration Tests', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Public Endpoints', () => {
    describe('GET /articles', () => {
      beforeEach(async () => {
        const user = await prisma.user.create({
          data: {
            email: 'author@test.com',
            password: 'pass',
            nickname: 'Author',
          },
        });

        for (let i = 1; i <= 12; i++) {
          await prisma.article.create({
            data: {
              title: `Article Title ${i}`,
              content: `Content for article number ${i}`,
              userId: user.id,
            },
          });
        }
      });

      it('should fetch articles with default pagination', async () => {
        const response = await request(app).get('/articles');

        expect(response.status).toBe(200);
        expect(response.body.list).toHaveLength(10);
        expect(response.body.totalCount).toBe(12);
      });

      it('should support pagination with custom parameters', async () => {
        const response = await request(app).get('/articles?page=2&pageSize=5');

        expect(response.status).toBe(200);
        expect(response.body.list).toHaveLength(5);
      });

      it('should search articles by keyword', async () => {
        const response = await request(app).get('/articles?keyword=Article 5');

        expect(response.status).toBe(200);
        expect(response.body.list.length).toBeGreaterThan(0);
        expect(response.body.list[0].title).toContain('5');
      });
    });

    describe('GET /articles/:id', () => {
      it('should return article when it exists', async () => {
        const user = await prisma.user.create({
          data: {
            email: 'writer@test.com',
            password: 'pass',
            nickname: 'Writer',
          },
        });

        const article = await prisma.article.create({
          data: {
            title: 'Sample Article',
            content: 'This is the content',
            userId: user.id,
          },
        });

        const response = await request(app).get(`/articles/${article.id}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Sample Article');
        expect(response.body.content).toBe('This is the content');
      });

      it('should return 404 for non-existent article', async () => {
        const response = await request(app).get('/articles/88888');

        expect(response.status).toBe(404);
      });
    });
  });

  describe('Protected Endpoints', () => {
    describe('POST /articles', () => {
      it('should deny unauthenticated user', async () => {
        const response = await request(app)
          .post('/articles')
          .send({
            title: 'Unauthorized Article',
            content: 'Should not be created',
          });

        expect(response.status).toBe(401);
      });

      it('should create article for authenticated user', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'poster@test.com',
          password: 'pass123',
          nickname: 'Poster',
        });

        await agent.post('/auth/login').send({
          email: 'poster@test.com',
          password: 'pass123',
        });

        const articleData = {
          title: 'My New Article',
          content: 'Interesting content here',
        };

        const response = await agent.post('/articles').send(articleData);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(articleData.title);
        expect(response.body.content).toBe(articleData.content);
      });
    });

    describe('PATCH /articles/:id', () => {
      it('should let owner update their article', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'editor@test.com',
          password: 'pass123',
          nickname: 'Editor',
        });

        await agent.post('/auth/login').send({
          email: 'editor@test.com',
          password: 'pass123',
        });

        const createRes = await agent.post('/articles').send({
          title: 'Draft Title',
          content: 'Draft content',
        });

        const articleId = createRes.body.id;

        const updateRes = await agent.patch(`/articles/${articleId}`).send({
          title: 'Final Title',
          content: 'Final content',
        });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.title).toBe('Final Title');
      });

      it('should deny update from non-owner', async () => {
        const author = await prisma.user.create({
          data: {
            email: 'originalauthor@test.com',
            password: 'pass',
            nickname: 'Original Author',
          },
        });

        const article = await prisma.article.create({
          data: {
            title: 'Original Title',
            content: 'Original Content',
            userId: author.id,
          },
        });

        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'hacker@test.com',
          password: 'pass123',
          nickname: 'Hacker',
        });

        await agent.post('/auth/login').send({
          email: 'hacker@test.com',
          password: 'pass123',
        });

        const response = await agent.patch(`/articles/${article.id}`).send({
          title: 'Hacked Title',
        });

        expect(response.status).toBe(403);
      });
    });

    describe('DELETE /articles/:id', () => {
      it('should allow owner to delete article', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'remover@test.com',
          password: 'pass123',
          nickname: 'Remover',
        });

        await agent.post('/auth/login').send({
          email: 'remover@test.com',
          password: 'pass123',
        });

        const createRes = await agent.post('/articles').send({
          title: 'To Delete',
          content: 'Will be removed',
        });

        const articleId = createRes.body.id;

        const deleteRes = await agent.delete(`/articles/${articleId}`);

        expect(deleteRes.status).toBe(200);

        const checkRes = await agent.get(`/articles/${articleId}`);
        expect(checkRes.status).toBe(404);
      });
    });
  });
});
