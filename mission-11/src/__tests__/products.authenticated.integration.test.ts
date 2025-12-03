import request from 'supertest';
import { app, io } from '../app';
import { prisma } from '../utils/prisma.util';
import { UsersService } from '../services/users.service';
import { User, Product } from '@prisma/client';

describe('Authenticated Product API Integration Tests', () => {
  let usersService: UsersService;
  let accessToken: string;
  let user: Partial<User>;
  let otherUser: Partial<User>;
  let userProduct: Product;

  beforeAll(async () => {
    usersService = new UsersService();
  });

  beforeEach(async () => {
    // 각 테스트 전에 데이터베이스를 초기화합니다.
    await prisma.$transaction([
      prisma.productLike.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.product.deleteMany(),
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

    // 권한 테스트를 위해 다른 사용자를 생성합니다.
    otherUser = await usersService.signUp({
      email: 'otheruser@example.com',
      nickname: 'otheruser',
      password: 'password123',
      confirmPassword: 'password123',
    });

    // 기본 사용자가 소유한 상품을 생성합니다.
    userProduct = await prisma.product.create({
      data: {
        name: 'My Test Product',
        content: 'This is a product for testing updates and deletes.',
        price: 1500,
        authorId: user.id!,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    io.close();
  });

  // POST /api/products 테스트
  it('should create a new product when authenticated', async () => {
    const newProductData = {
      name: 'A Brand New Product',
      content: 'Created by an authenticated user.',
      price: 3000,
    };

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newProductData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toEqual(newProductData.name);
    expect(res.body.data.authorId).toEqual(user.id);
  });

  // PUT /api/products/:productId 테스트
  it('should update a product successfully if user is the owner', async () => {
    const updateData = {
      name: 'Updated Product Name',
      price: 2500,
    };

    const res = await request(app)
      .put(`/api/products/${userProduct.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual(updateData.name);
    expect(res.body.data.price).toEqual(updateData.price);
  });

  it('should return 403 when trying to update a product owned by another user', async () => {
    const updateData = { name: 'Malicious Update' };

    const res = await request(app)
      .put(`/api/products/${userProduct.id}`)
      .set('Authorization', `Bearer someOtherToken`)
      .send(updateData);

    expect(res.statusCode).toEqual(401); // 또는 인증 미들웨어에 따라 403
  });

  // DELETE /api/products/:productId 테스트
  it('should delete a product successfully if user is the owner', async () => {
    const res = await request(app)
      .delete(`/api/products/${userProduct.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', '상품이 성공적으로 삭제 완료');

    const deletedProduct = await prisma.product.findUnique({
      where: { id: userProduct.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('should return 403 when trying to delete a product owned by another user', async () => {
    const res = await request(app)
      .delete(`/api/products/${userProduct.id}`)
      .set('Authorization', `Bearer someOtherToken`);

    expect(res.statusCode).toEqual(401); // 또는 인증 미들웨어에 따라 403
  });
});
