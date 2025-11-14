//src/__tests__/integration/product_auth.test.ts
import request from 'supertest';
import app from '../../app';
import { clearDatabase, createTestUser, generateToken, prisma } from '../utils/test_helpers';

describe('Product API (Auth Required)', () => {
  let user: any;
  let token: string;

  beforeEach(async () => {
    await clearDatabase();
    user = await createTestUser({
      email: 'seller@test.com',
      nickname: '판매자',
      password: 'password123',
    });
    token = generateToken(user.id, user.email);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('인증된 사용자는 상품을 생성할 수 있어야 함', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '새 상품',
          description: '상품 설명',
          price: 10000,
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('새 상품');
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('작성자는 상품을 수정할 수 있어야 함', async () => {
      const product = await prisma.product.create({
        data: {
          title: '기존 상품',
          description: '설명',
          price: 10000,
          ownerId: user.id,
        },
      });

      const response = await request(app)
        .patch(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '수정된 상품',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('수정된 상품');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('작성자는 상품을 삭제할 수 있어야 함', async () => {
      const product = await prisma.product.create({
        data: {
          title: '삭제할 상품',
          description: '설명',
          price: 10000,
          ownerId: user.id,
        },
      });

      const response = await request(app)
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/products/:id/like', () => {
    it('사용자는 상품에 좋아요를 추가할 수 있어야 함', async () => {
      const product = await prisma.product.create({
        data: {
          title: '좋아요 테스트 상품',
          description: '설명',
          price: 10000,
          ownerId: user.id,
        },
      });

      const response = await request(app)
        .post(`/api/products/${product.id}/like`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});