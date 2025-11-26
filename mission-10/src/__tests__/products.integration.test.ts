import request from 'supertest';
import { app, io } from '../app';
import { prisma } from '../utils/prisma.util';

describe('Public Product API Integration Tests', () => {
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.productLike.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password123',
      },
    });

    await prisma.product.createMany({
      data: [
        {
          name: 'Product 1',
          content: 'Description 1',
          price: 1000,
          authorId: user.id,
        },
        {
          name: 'Product 2',
          content: 'Description 2',
          price: 2000,
          authorId: user.id,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    io.close();
  });

  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('content');
    expect(res.body.data[0]).toHaveProperty('price');
  });

  it('should fetch a single product by ID', async () => {
    const product = await prisma.product.findFirst();
    if (!product) throw new Error('No product found to test with');

    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.statusCode).toEqual(200);

    expect(res.body.data).toHaveProperty('id', product.id);
    expect(res.body.data).toHaveProperty('name', product.name);
    expect(res.body.data).toHaveProperty('content', product.content);
    expect(res.body.data).toHaveProperty('price', product.price);
  });

  it('should return 404 if product not found', async () => {
    const nonExistentProductId = 99999;
    const res = await request(app).get(`/api/products/${nonExistentProductId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
  });
});