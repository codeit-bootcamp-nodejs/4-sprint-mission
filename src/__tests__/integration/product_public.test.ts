//src/__tests__/integration/product_public.test.ts
import request from 'supertest';
import app from '../../app';
import { clearDatabase, createTestUser, prisma } from '../utils/test_helpers';

describe('Product API (Public)', () => {
  let user: any;

    beforeEach(async () => {
        await clearDatabase();

        user = await createTestUser({
            email: 'productpublic@test.com',
            nickname: '판매자',
            password: 'password123',
        });

        await prisma.product.createMany({
            data: [
                {
                    title: '테스트 상품 1',
                    description: '설명 1',
                    price: 10000,
                    ownerId: user.id,
                },
                {
                    title: '테스트 상품 2',
                    description: '설명 2',
                    price: 20000,
                    ownerId: user.id,
                },
            ],
        });
    });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/products', () => {
    it('상품 목록을 조회해야 함', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('특정 상품을 조회해야 함', async () => {
      const product = await prisma.product.findFirst();

      expect(product).not.toBeNull();

      const response = await request(app).get(`/api/products/${product!.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product!.id);
    });

    it('존재하지 않는 상품 조회 시 404를 반환해야 함', async () => {
      const response = await request(app).get('/api/products/99999');

      expect(response.status).toBe(404);
    });
  });
});