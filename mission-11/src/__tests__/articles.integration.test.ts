import request from 'supertest';
import { app, io } from '../app';
import { prisma } from '../utils/prisma.util';

describe('Public Article API Integration Tests', () => {
  let user;

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.articleLike.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.article.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    user = await prisma.user.create({
      data: {
        email: 'test.article@example.com',
        nickname: 'testarticleuser',
        password: 'password123',
      },
    });

    await prisma.article.createMany({
      data: [
        { title: 'Article 1', content: 'Content 1', authorId: user.id },
        { title: 'Article 2', content: 'Content 2', authorId: user.id },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    io.close();
  });

  it('should fetch all articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('content');
  });

  it('should fetch a single article by ID', async () => {
    const article = await prisma.article.findFirst();
    if (!article) throw new Error('No article found to test with');

    const res = await request(app).get(`/api/articles/${article.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('id', article.id);
    expect(res.body.data).toHaveProperty('title', article.title);
    expect(res.body.data).toHaveProperty('content', article.content);
  });

  it('should return 404 if article not found', async () => {
    const nonExistentArticleId = 99999;
    const res = await request(app).get(`/api/articles/${nonExistentArticleId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
  });
});
