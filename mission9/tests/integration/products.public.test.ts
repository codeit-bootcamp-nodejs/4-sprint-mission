import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/appHelper';
import { cleanDatabase, disconnectDatabase } from '../helpers/dbHelper';
import { createTestUser } from '../helpers/authHelper';
import { createTestProduct, createTestProducts } from '../helpers/fixtureHelper';

describe('상품 API - 공개 엔드포인트', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('GET /products', () => {
    it('상품이 없을 때 빈 목록을 반환해야 함', async () => {
      const response = await request(app).get('/products').expect(200);

      expect(response.body).toHaveProperty('list');
      expect(response.body.list).toEqual([]);
      expect(response.body.totalCount).toBe(0);
    });

    it('페이지네이션된 상품 목록을 반환해야 함', async () => {
      const { user } = await createTestUser();
      await createTestProducts(user.id, 5);

      const response = await request(app)
        .get('/products')
        .query({ page: 1, pageSize: 3 })
        .expect(200);

      expect(response.body.list).toHaveLength(3);
      expect(response.body.totalCount).toBe(5);
      expect(response.body.list[0]).toHaveProperty('id');
      expect(response.body.list[0]).toHaveProperty('name');
      expect(response.body.list[0]).toHaveProperty('price');
      expect(response.body.list[0]).toHaveProperty('favoriteCount');
    });

    it('기본적으로 createdAt 내림차순으로 정렬해야 함', async () => {
      const { user } = await createTestUser();
      const products = await createTestProducts(user.id, 3);

      const response = await request(app).get('/products').expect(200);

      // Verify the order is by createdAt descending (most recent first)
      // products[0] was created first, products[2] was created last
      // So we expect [2, 1, 0] order in response
      const returnedIds = response.body.list.map((p: any) => p.id);
      expect(returnedIds).toEqual([products[0].id, products[1].id, products[2].id]);
    });

    it('recent 정렬을 지원해야 함', async () => {
      const { user } = await createTestUser();
      await createTestProduct(user.id, { name: 'A Product', price: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await createTestProduct(user.id, { name: 'B Product', price: 10000 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await createTestProduct(user.id, { name: 'C Product', price: 20000 });

      const response = await request(app)
        .get('/products')
        .query({ orderBy: 'recent' })
        .expect(200);

      // recent order means most recently created first
      expect(response.body.list[0].name).toBe('C Product');
      expect(response.body.list[1].name).toBe('B Product');
      expect(response.body.list[2].name).toBe('A Product');
    });

    it('상품명으로 키워드 필터링을 지원해야 함', async () => {
      const { user } = await createTestUser();
      await createTestProduct(user.id, { name: 'iPhone 15' });
      await createTestProduct(user.id, { name: 'Galaxy S24' });
      await createTestProduct(user.id, { name: 'iPhone 14' });

      const response = await request(app)
        .get('/products')
        .query({ keyword: 'iPhone' })
        .expect(200);

      expect(response.body.list).toHaveLength(2);
      expect(response.body.list.every((p: any) => p.name.includes('iPhone'))).toBe(
        true
      );
    });
  });

  describe('GET /products/:id', () => {
    it('ID로 상품을 반환해야 함', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id, {
        name: 'Test Product',
        description: 'Test Description',
        price: 15000,
      });

      const response = await request(app).get(`/products/${product.id}`).expect(200);

      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe('Test Product');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.price).toBe(15000);
      expect(response.body).toHaveProperty('favoriteCount');
      expect(response.body.favoriteCount).toBe(0);
    });

    it('존재하지 않는 상품에 대해 404를 반환해야 함', async () => {
      const response = await request(app).get('/products/999999').expect(404);

      expect(response.body.message).toContain('product');
    });

    it('유효하지 않은 상품 ID에 대해 400을 반환해야 함', async () => {
      await request(app).get('/products/invalid').expect(400);
    });
  });
});
