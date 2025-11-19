import { app } from '@/app.js';
import { passwordHashing } from '@/lib/bcrypt.js';
import prisma from '@/lib/prisma.js';
import request from 'supertest';

describe('Article API', () => {
  let userToken: string;
  let user2Token: string;
  let userId: number;
  let user2Id: number;
  let articleId: number;
  let article2Id: number;

  beforeEach(async () => {
    const hashedPassword = await passwordHashing('12345678');
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        nickname: 'testUser1',
        password: hashedPassword,
      },
    });
    const hashedPassword2 = await passwordHashing('123456789');
    const user2 = await prisma.user.create({
      data: {
        email: 'test2@test.com',
        nickname: 'testUser2',
        password: hashedPassword2,
      },
    });
    const userLoginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password: '12345678',
    });
    const userLoginResponse2 = await request(app).post('/auth/login').send({
      email: user2.email,
      password: '123456789',
    });
    userId = user.id;
    user2Id = user2.id;
    userToken = userLoginResponse.body.accessToken;
    user2Token = userLoginResponse2.body.accessToken;

    const article1 = await prisma.article.create({
      data: {
        title: 'test1',
        content: 'test1',
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    articleId = article1.id;
    const article2 = await prisma.article.create({
      data: {
        title: 'test2',
        content: 'test2',
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    article2Id = article2.id;
    await prisma.articleLike.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });
    await prisma.articleLike.create({
      data: {
        userId: user2Id,
        articleId: articleId,
      },
    });
    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        likeCount: {
          increment: 2,
        },
      },
    });
    await prisma.articleImage.createMany({
      data: {
        publicId: 'test1',
        url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        articleId: articleId,
      },
    });
  });
  describe('POST /article', () => {
    const articleData = {
      title: 'test1',
      content: 'test1',
      imageUrls: [
        'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test999.png',
      ],
    };
    it('게시글 생성', async () => {
      // when
      const response = await request(app)
        .post('/article')
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData);
      // then
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('test1');
      expect(response.body.content).toBe('test1');
      expect(response.body.user.id).toEqual(userId);
      expect(response.body.likeCount).toBe(0);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.images.length).toBe(1);
    });
    it('유효하지않은 데이터를 전송하면 400 에러 발생', async () => {
      // when
      const response = await request(app)
        .post('/article')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: null,
        });
      // then
      expect(response.status).toBe(400);
    });
    it('로그인 하지 않은 유저가 요청하면 401 에러 발생', async () => {
      // when
      const response = await request(app).post('/article').send(articleData);
      // then
      expect(response.status).toBe(401);
    });
  });
  describe('GET /article', () => {
    it('게시글 목록 조회는 페이지네이션이 적용된다.', async () => {
      // when
      const response = await request(app).get('/article?page=1&pageSize=2');
      // then
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });
    it('게시글 목록은 제목이나 내용을 기준으로 검색이 가능하다', async () => {
      // when
      const response = await request(app).get('/article?keyword=test');
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
    it('로그인 된 유저가 게시글 목록을 요청할 경우 자신이 좋아요 누른 상품에 isLike: true를 포함해야한다.', async () => {
      // when
      const response = await request(app)
        .get('/article')
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].isLike).toBeFalsy();
      expect(response.body[1].isLike).toBeTruthy();
    });
    it('로그인 하지 않은 유저가 게시글 목록을 요청할 경우 모든 상품마다 isLike: false를 포함해야한다.', async () => {
      // when
      const response = await request(app).get('/article');
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].isLike).toBeFalsy();
      expect(response.body[1].isLike).toBeFalsy();
    });
  });
  describe('GET /article/:id', () => {
    it('로그인 한 유저가 단일 게시글 조회 시 좋아요 누른 게시글이면 isLike: true 포함', async () => {
      // when
      const response = await request(app)
        .get(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeTruthy();
    });
    it('로그인 한 유저가 단일 게시글 조회 시 좋아요 안 누른 게시글이면 isLike: false 포함', async () => {
      // when
      const response = await request(app)
        .get(`/article/${article2Id}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeFalsy();
    });
    it('로그인 하지 않은 유저가 단일 게시글 조회 시 isLike: false 포함', async () => {
      // when
      const response = await request(app).get(`/article/${articleId}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeFalsy();
    });
    it('존재하지 않는 게시글을 조회하면 404 에러 반환', async () => {
      // when
      const response = await request(app).get(`/article/999`);
      // then
      expect(response.status).toBe(404);
    });
    it('유효하지않은 게시글 id를 조회하면 400 에러 반환', async () => {
      // when
      const response = await request(app).get(`/article/invalid`);
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('PATCH /article/:id', () => {
    it('게시글의 일반 필드만 수정하면 트랜잭션없이 수정 된다.', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '일반 필드 수정 테스트',
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.content).toEqual('일반 필드 수정 테스트');
    });
    it('새로운 이미지가 추가되면 새로운 이미지 url을 포함해서 반환해야한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '이미지 수정 테스트1',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.content).toEqual('이미지 수정 테스트1');
      expect(response.body.images[0].publicId).toBe('test1');
      expect(response.body.images[1].publicId).toBe('test2');
      expect(response.body.images.length).toBe(2);
    });
    it('이미지 삭제되면 해당 이미지의 url이 삭제된 상품을 반환해야 한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '이미지 수정 테스트2',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.content).toEqual('이미지 수정 테스트2');
      expect(response.body.images[0].publicId).toBe('test2');
      expect(response.body.images.length).toBe(1);
    });
    it('이미지 추가 / 삭제되면 해당 이미지의 url이 추가 / 삭제된 상품을 반환해야 한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '이미지 수정 테스트3',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test3.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.content).toEqual('이미지 수정 테스트3');
      expect(response.body.images[0].publicId).toBe('test2');
      expect(response.body.images[1].publicId).toBe('test3');
      expect(response.body.images.length).toBe(2);
    });
    it('존재하지 않는 게시글 id를 조회하면 404 에러 반환', async () => {
      // when
      const response = await request(app)
        .patch(`/article/999`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '수정 오류 테스트1',
        });
      // then
      expect(response.status).toBe(404);
    });
    it('유저가 생성한 게시글이 아닌 경우 403 에러 반환', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          content: '수정 오류 테스트2',
        });
      // then
      expect(response.status).toBe(403);
    });
    it('수정할 데이터가 하나도 없는 경우 400 에러 반환', async () => {
      // when
      const response = await request(app)
        .patch(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(400);
    });
    it('로그인 하지 않은 유저가 요청하면 401 에러 발생', async () => {
      // when
      const response = await request(app).patch(`/article/${articleId}`).send({
        content: '수정 오류 테스트4',
      });
      // then
      expect(response.status).toBe(401);
    });
    it('유효하지않은 게시글 id를 요청하면 400 에러 반환', async () => {
      // when
      const response = await request(app)
        .patch(`/article/invalid`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '수정 오류 테스트5',
        });
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('DELETE /article/:id', () => {
    it('상품이 삭제될 때 이미지도 함께 삭제된다.', async () => {
      // when
      const response = await request(app)
        .delete(`/article/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      const images = await prisma.articleImage.findMany({
        where: {
          articleId,
        },
      });
      expect(images.length).toBe(0);
    });
    it('존재하지 않는 게시글 id를 조회하면 404 에러 반환', async () => {
      // when
      const response = await request(app)
        .delete(`/article/999`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(404);
    });
    it('유저가 생성한 게시글이 아닌 경우 403 에러 반환', async () => {
      // when
      const response = await request(app)
        .delete(`/article/${articleId}`)
        .set('Authorization', `Bearer ${user2Token}`);
      // then
      expect(response.status).toBe(403);
    });
    it('로그인 하지 않은 유저가 요청하면 401 에러 발생', async () => {
      // when
      const response = await request(app).delete(`/article/${articleId}`);
      // then
      expect(response.status).toBe(401);
    });
    it('유효하지않은 게시글 id를 요청하면 400 에러 반환', async () => {
      // when
      const response = await request(app)
        .delete(`/article/invalid`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(400);
    });
  });
});
