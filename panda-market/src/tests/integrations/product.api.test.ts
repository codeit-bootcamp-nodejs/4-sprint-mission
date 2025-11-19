import request from 'supertest';
import { app } from '@/app.js';
import {
  createInput,
  createParams,
} from '@/tests/fixtures/product.fixtures.js';
import prisma from '@/lib/prisma.js';
import { passwordHashing } from '@/lib/bcrypt.js';

describe('Product API', () => {
  let userToken: string;
  let user2Token: string;
  let userId: number;
  let user2Id: number;
  let productId: number;
  let product2Id: number;

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

    const product1 = await prisma.product.create({
      data: {
        ...createInput,
        tags: {
          connectOrCreate: [
            {
              where: { name: 'test1' },
              create: { name: 'test1' },
            },
            {
              where: { name: 'test2' },
              create: { name: 'test2' },
            },
          ],
        },
      },
    });
    productId = product1.id;

    const product2 = await prisma.product.create({
      data: {
        ...createInput,
        name: 'test2',
        tags: {
          connectOrCreate: [
            {
              where: { name: 'test1' },
              create: { name: 'test1' },
            },
            {
              where: { name: 'test2' },
              create: { name: 'test2' },
            },
          ],
        },
      },
    });
    product2Id = product2.id;

    await prisma.productLike.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });
    await prisma.productLike.create({
      data: {
        userId: user2Id,
        productId: productId,
      },
    });
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        likeCount: {
          increment: 2,
        },
      },
    });
    await prisma.productImage.createMany({
      data: {
        publicId: 'test1',
        url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        productId: productId,
      },
    });
  });
  describe('POST /product', () => {
    const productData = {
      ...createParams,
      imageUrls: [
        'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test999.png',
      ],
    };
    it('상품 생성', async () => {
      // when
      const response = await request(app)
        .post('/product')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);
      // then
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(createParams.name);
      expect(response.body.description).toBe(createParams.description);
      expect(response.body.price).toBe(createParams.price);

      expect(response.body.id).toBeDefined();
      expect(response.body.user.id).toEqual(userId);
      expect(response.body.createdAt).toBeDefined();

      expect(response.body.tags[0].name).toBe(createParams.tags[0]);
      expect(response.body.images.length).toBe(1);
    });
    it('중복된 태그가 입력되면 400 에러 반환', async () => {
      // when
      const response = await request(app)
        .post('/product')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...productData, tags: ['test', 'test'] });
      // then
      expect(response.status).toBe(400);
    });
    it('로그인 하지 않은 유저가 요청하면 401 에러 반환', async () => {
      // when
      const response = await request(app).post('/product').send(productData);
      // then
      expect(response.status).toBe(401);
    });
    it('유효하지 않은 데이터를 전송하면 400 에러 반환', async () => {
      // when
      const response = await request(app)
        .post('/product')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: 'error',
        });
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('GET /product', () => {
    it('상품 목록 조회는 페이지네이션이 적용된다.', async () => {
      // when
      const response = await request(app).get('/product?page=1&pageSize=2');
      // then
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });
    it('상품 목록은 제목이나 내용을 기준으로 검색이 가능하다', async () => {
      // when
      const response = await request(app).get('/product?keyword=test');
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
    it('로그인 된 유저가 상품 목록을 요청할 경우 자신이 좋아요 누른 상품에 isLike: true를 포함해야한다.', async () => {
      // when
      const response = await request(app)
        .get('/product')
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].isLike).toBeFalsy();
      expect(response.body[1].isLike).toBeTruthy();
    });
    it('로그인 하지 않은 유저가 상품 목록을 요청할 경우 모든 상품마다 isLike: false를 포함해야한다.', async () => {
      // when
      const response = await request(app).get('/product');
      // then
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].isLike).toBeFalsy();
      expect(response.body[1].isLike).toBeFalsy();
    });
  });
  describe('GET /product/:id', () => {
    it('로그인 한 유저가 단일 상품 조회시 좋아요 누른 상품이면 isLike: true 포함', async () => {
      // when
      const response = await request(app)
        .get(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeTruthy();
    });
    it('로그인 한 유저가 좋아요 안 누른 상품이면 isLike: false 포함', async () => {
      // when
      const response = await request(app)
        .get(`/product/${product2Id}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeFalsy();
    });
    it('로그인 하지 않은 유저가 단일 상품 조회시 isLike: false 포함', async () => {
      // when
      const response = await request(app).get(`/product/${productId}`);
      // then
      expect(response.status).toBe(200);
      expect(response.body.isLike).toBeFalsy();
    });
    it('존재하지않는 상품을 조회하면 404 에러 반환', async () => {
      // when
      const response = await request(app).get(`/product/999`);
      // then
      expect(response.status).toBe(404);
    });
    it('유효하지않은 상품 id를 입력하면 400 에러 반환', async () => {
      // when
      const response = await request(app).get(`/product/invalid`);
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('PATCH /product/:id', () => {
    it('상품의 일반 필드만 수정하면 트랜잭션 없이 업데이트 된다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '일반 필드 수정 테스트',
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('일반 필드 수정 테스트');
    });
    it('새로운 태그가 추가되면 해당 태그 카운트가 증가한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '태그 수정 테스트1',
          tags: ['test1', 'newTag'],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('태그 수정 테스트1');
      expect(response.body.tags.length).toBe(2);
      expect(response.body.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'test1' }),
          expect.objectContaining({ name: 'newTag' }),
        ]),
      );
      const newTagInDb = await prisma.tag.findUnique({
        where: { name: 'newTag' },
      });
      expect(newTagInDb).not.toBeNull();
      expect(newTagInDb!.productCount).toBe(1);
    });
    it('기존 태그가 삭제되면 해당 태그 카운트가 감소한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '태그 수정 테스트2',
          tags: ['test1'],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('태그 수정 테스트2');
      expect(response.body.tags.length).toBe(1);

      const oldTagInDb = await prisma.tag.findUnique({
        where: { name: 'test2' },
      });
      expect(oldTagInDb).not.toBeNull();
      expect(oldTagInDb!.productCount).toBe(0);
    });
    it('태그가 추가 / 삭제 되면 카운트가 증가 / 감소 해야한다.', async () => {
      // given
      const oldTagInDb = await prisma.tag.findUnique({
        where: { name: 'test2' },
      });
      // then
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '태그 수정 테스트3',
          tags: ['test1', 'newTag'],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('태그 수정 테스트3');
      expect(response.body.tags.length).toBe(2);

      expect(oldTagInDb).not.toBeNull();
      expect(oldTagInDb!.productCount).toBe(0);
      const newTagInDb = await prisma.tag.findUnique({
        where: { name: 'newTag' },
      });
      expect(newTagInDb).not.toBeNull();
      expect(newTagInDb!.productCount).toBe(1);
    });
    it('이미지가 추가되면 새로운 이미지 url을 포함해서 반환해야한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '이미지 수정 테스트1',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('이미지 수정 테스트1');
      expect(response.body.images[0].publicId).toBe('test1');
      expect(response.body.images[1].publicId).toBe('test2');
      expect(response.body.images.length).toBe(2);
    });
    it('이미지가 삭제되면 해당 이미지의 url이 삭제된 상품을 반환해야 한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '이미지 수정 테스트2',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('이미지 수정 테스트2');
      expect(response.body.images[0].publicId).toBe('test2');
      expect(response.body.images.length).toBe(1);
    });
    it('이미지가 추가 / 삭제되면 해당 이미지의 url이 추가 / 삭제된 상품을 반환해야 한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '이미지 수정 테스트3',
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test3.png',
          ],
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('이미지 수정 테스트3');
      expect(response.body.images[0].publicId).toBe('test2');
      expect(response.body.images[1].publicId).toBe('test3');
      expect(response.body.images.length).toBe(2);
    });
    it('상품 가격이 변경된 경우 해당 상품에 좋아요를 누른 유저에게 알림이 발송되어야 한다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '가격 수정 테스트1',
          price: 2,
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('가격 수정 테스트1');
      expect(response.body.price).toEqual(2);
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: user2Id,
        },
      });
      if (notification) {
        expect(notification.isRead).toBe(false);
        expect(notification.type).toBe('PRICE_UPDATE_PRODUCT');
        expect(notification.targetId).toBe(productId);
        expect(notification.senderId).toBe(userId);
      }
      expect(notification).not.toBeNull();
    });
    it('상품 가격이 변경됐을 때 해당 상품에 좋아요를 누른 유저가 없다면 알림이 발송되지 않는다.', async () => {
      // given
      await prisma.productLike.delete({
        where: {
          userId_productId: {
            userId: user2Id,
            productId,
          },
        },
      });
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '가격 수정 테스트2',
          price: 2,
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('가격 수정 테스트2');
      expect(response.body.price).toEqual(2);
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: user2Id,
        },
      });
      expect(notification).toBeNull();
    });
    it('상품 가격이 변경됐을 때 해당 상품에 좋아요를 누른 유저가 자기 자신이면 알림이 발송되지 않는다.', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '가격 수정 테스트3',
          price: 2,
        });
      // then
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual('가격 수정 테스트3');
      expect(response.body.price).toEqual(2);
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: userId,
        },
      });
      expect(notification).toBeNull();
    });
    it('잘못된 상품 id로 요청할 경우 404 오류 발생', async () => {
      // when
      const response = await request(app)
        .patch(`/product/999`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: '수정 오류 테스트1',
        });
      // then
      expect(response.status).toBe(404);
    });
    it('유저가 생성한 상품이 아닐 경우 403 오류 발생', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          description: '수정 오류 테스트2',
        });
      // then
      expect(response.status).toBe(403);
    });
    it('수정할 데이터가 하나도 없는 경우 400 오류 발생', async () => {
      // when
      const response = await request(app)
        .patch(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});
      // then
      expect(response.status).toBe(400);
    });
  });
  describe('DELETE /product/:id', () => {
    it('상품이 삭제될 때 이미지, 태그도 함께 삭제된다.', async () => {
      // when
      const response = await request(app)
        .delete(`/product/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(200);
      const tags = await prisma.tag.findMany();
      expect(tags[0].productCount).toBe(0);
      expect(tags[1].productCount).toBe(0);
      const images = await prisma.productImage.findMany({
        where: {
          productId,
        },
      });
      expect(images.length).toBe(0);
    });
    it('해당 상품이 유저가 생성한 상품이 아닐 때 403 에러 발생', async () => {
      // when
      const response = await request(app)
        .delete(`/product/${productId}`)
        .set('Authorization', `Bearer ${user2Token}`);
      // then
      expect(response.status).toBe(403);
    });
    it('잘못된 상품 id로 요청할 경우 404 오류 발생', async () => {
      // when
      const response = await request(app)
        .delete(`/product/999`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(404);
    });
    it('유효하지않은 id로 요청할 경우 400 오류 발생', async () => {
      // when
      const response = await request(app)
        .delete(`/product/invalid`)
        .set('Authorization', `Bearer ${userToken}`);
      // then
      expect(response.status).toBe(400);
    });
  });
});
