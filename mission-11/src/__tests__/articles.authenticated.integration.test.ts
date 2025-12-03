import request from 'supertest';
import { app, io } from '../app';
import { prisma } from '../utils/prisma.util';
import { UsersService } from '../services/users.service';
import { User, Article } from '@prisma/client';

describe('Authenticated Article API Integration Tests', () => {
  let usersService: UsersService;
  let accessToken: string;
  let user: Partial<User>;
  let userArticle: Article;

  beforeAll(() => {
    usersService = new UsersService();
  });

  beforeEach(async () => {
    // 각 테스트 전에 데이터베이스를 초기화합니다.
    await prisma.$transaction([
      prisma.articleLike.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.article.deleteMany(),
      prisma.refreshToken.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // 기본 사용자를 생성하고 로그인합니다.
    user = await usersService.signUp({
      email: 'testuser@example.com',
      nickname: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    });
    const loginRes = await request(app).post('/api/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    accessToken = loginRes.body.data.accessToken;

    // 기본 사용자가 소유한 게시글을 생성합니다.
    userArticle = await prisma.article.create({
      data: {
        title: 'My Test Article',
        content: 'This is an article for testing updates and deletes.',
        authorId: user.id!,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    io.close();
  });

  // POST /api/articles 테스트
  it('should create a new article when authenticated', async () => {
    const newArticleData = {
      title: 'A Brand New Article',
      content: 'Created by an authenticated user.',
    };

    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newArticleData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.title).toEqual(newArticleData.title);
    expect(res.body.data.authorId).toEqual(user.id);
  });

  // PUT /api/articles/:articleId 테스트
  it('should update an article successfully if user is the owner', async () => {
    const updateData = {
      title: 'Updated Article Title',
      content: 'Updated content.',
    };

    const res = await request(app)
      .put(`/api/articles/${userArticle.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toEqual(updateData.title);
    expect(res.body.data.content).toEqual(updateData.content);
  });

  it('should return 403 when trying to update an article owned by another user', async () => {
    const updateData = { title: 'Malicious Update' };

    const otherUser = await usersService.signUp({
      email: 'otheruser@example.com',
      nickname: 'otheruser',
      password: 'password123',
      confirmPassword: 'password123',
    });
    const otherLoginRes = await request(app).post('/api/login').send({
      email: 'otheruser@example.com',
      password: 'password123',
    });
    const otherAccessToken = otherLoginRes.body.data.accessToken;

    const res = await request(app)
      .put(`/api/articles/${userArticle.id}`)
      .set('Authorization', `Bearer ${otherAccessToken}`)
      .send(updateData);

    expect(res.statusCode).toEqual(403);
  });

  // DELETE /api/articles/:articleId 테스트
  it('should delete an article successfully if user is the owner', async () => {
    const res = await request(app)
      .delete(`/api/articles/${userArticle.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', '게시글이 성공적으로 삭제되었습니다.');

    const deletedArticle = await prisma.article.findUnique({
      where: { id: userArticle.id },
    });
    expect(deletedArticle).toBeNull();
  });

  it('should return 403 when trying to delete an article owned by another user', async () => {
    const otherUser = await usersService.signUp({
        email: 'otheruser@example.com',
        nickname: 'otheruser',
        password: 'password123',
        confirmPassword: 'password123',
    });
    const otherLoginRes = await request(app).post('/api/login').send({
        email: 'otheruser@example.com',
        password: 'password123',
    });
    const otherAccessToken = otherLoginRes.body.data.accessToken;

    const res = await request(app)
      .delete(`/api/articles/${userArticle.id}`)
      .set('Authorization', `Bearer ${otherAccessToken}`);

    expect(res.statusCode).toEqual(403);
  });
});
