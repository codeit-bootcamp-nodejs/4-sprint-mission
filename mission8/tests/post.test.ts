// 인증이 필요하지 않은 게시글 api 테스트 (특정 게시글 조회)
// 인증이 필요한 게시글 api 테스트 (게시글 등록)
import request from 'supertest';

import app from '../src/app';
import prisma from '../src/utils/prisma';

// 인증이 필요하지 않은 게시글 api 테스트 (특정 게시글 조회)
describe('GET /posts/:id (인증 필요 없음)', () => {
  let postId: number;

  beforeAll(async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        hashedPassword: 'password',
        username: 'test',
        lastLogin: new Date(),
      },
    });

    const post = await prisma.post.create({
      data: {
        title: 'Test Post',
        content: 'Test Post Content',
        userId: user.id,
      },
    });

    postId = post.id;
  });

  afterAll(async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('게시글 조회 성공', async () => {
    const res = await request(app).get(`/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(postId);
    expect(res.body.title).toBe('Test Post');
  });

  test('없는 게시글 → 404', async () => {
    const res = await request(app).get(`/posts/999999`);
    expect(res.status).toBe(404);
  });
});

// 인증이 필요한 게시글 api 테스트 (게시글 등록)
describe('POST /posts (인증 필요)', () => {
  let accessToken: string;
  let userId: number;

  beforeAll(async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const signup = await request(app)
      .post('/auth/register')
      .send({ email: 'user@test.com', password: 'password', username: 'test' });

    userId = signup.body.id;

    const login = await request(app).post('/auth/login').send({ email: 'user@test.com', password: 'password' });

    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('게시글 등록 성공', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${accessToken}`).send({
      title: 'New Post',
      content: 'New Post Content',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'New Post',
      content: 'New Post Content',
      userId,
    });
  });

  test('title 누락 → 400', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${accessToken}`).send({
      content: 'only content',
    });

    expect(res.status).toBe(400);
  });

  test('토큰 없이 등록 → 401', async () => {
    const res = await request(app).post('/posts').send({
      title: 'Fail Post',
      content: 'No token',
    });

    expect(res.status).toBe(401);
  });
});
