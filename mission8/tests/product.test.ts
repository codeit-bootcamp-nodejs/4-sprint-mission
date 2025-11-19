import request from 'supertest';

import app from '../src/app';
import prisma from '../src/utils/prisma';

// 인증 필요 상품 api 테스트
describe('PATCH /products/:id/price', () => {
  let accessToken: string;
  let productId: number;
  let userId: number;

  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123', username: 'test' });
    userId = registerRes.body.id;

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    accessToken = loginRes.body.accessToken;

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'test',
        price: 5000,
        userId,
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('상품 가격을 변경', async () => {
    const newPrice = 10000;

    const res = await request(app)
      .patch(`/products/${productId}/price`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ price: newPrice });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: '가격이 성공적으로 변경되었습니다',
      newPrice,
      productId,
    });

    const productInDb = await prisma.product.findUnique({ where: { id: productId } });
    expect(productInDb).not.toBeNull();
    expect(productInDb!.price).toBe(newPrice);
  });

  it('존재하지 않는 상품 -> 404', async () => {
    const res = await request(app)
      .patch(`/products/999999/price`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ price: 1234 });

    expect(res.status).toBe(404);
  });

  it('유효하지 않은 가격 -> 400', async () => {
    const res = await request(app)
      .patch(`/products/${productId}/price`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ price: -100 });

    expect(res.status).toBe(400);
  });
});

// 인증 필요 없는 상품 api 테스트
describe('GET /products/:id (인증 필요 없음)', () => {
  let productId: number;
  let userId: number;

  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        username: 'test',
        email: 'public@test.com',
        hashedPassword: 'test',
        lastLogin: new Date(),
      },
    });
    userId = user.id;

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Test Product Description',
        price: 5000,
        userId: userId,
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('상품 조회 성공', async () => {
    const res = await request(app).get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
    expect(res.body.name).toBe('Test Product');
  });

  test('없는 상품 조회 → 404', async () => {
    const res = await request(app).get('/products/999999');
    expect(res.status).toBe(404);
  });
});
