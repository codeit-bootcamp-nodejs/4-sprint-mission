import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/appHelper';
import { cleanDatabase, disconnectDatabase } from '../helpers/dbHelper';
import { createTestUser, getAuthCookie } from '../helpers/authHelper';
import { createTestProduct } from '../helpers/fixtureHelper';

describe('상품 API - 인증 엔드포인트', () => {
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

  describe('POST /products', () => {
    it('인증된 사용자가 새 상품을 생성해야 함', async () => {
      const { accessToken } = await createTestUser();
      const productData = {
        name: 'New Product',
        description: 'Product description',
        price: 25000,
        tags: ['electronics', 'test'],
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(productData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.tags).toEqual(productData.tags);
      expect(response.body.images).toEqual(productData.images);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const productData = {
        name: 'New Product',
        description: 'Product description',
        price: 25000,
        tags: ['test'],
        images: ['https://example.com/image.jpg'],
      };

      await request(app).post('/products').send(productData).expect(401);
    });

    it('필수 필드가 누락되었을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();
      const productData = {
        name: 'New Product',
        // missing description, price
        tags: ['test'],
        images: ['https://example.com/image.jpg'],
      };

      await request(app)
        .post('/products')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(productData)
        .expect(400);
    });

    it('가격이 음수일 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();
      const productData = {
        name: 'New Product',
        description: 'Product description',
        price: -1000,
        tags: ['test'],
        images: ['https://example.com/image.jpg'],
      };

      await request(app)
        .post('/products')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(productData)
        .expect(400);
    });
  });

  describe('PATCH /products/:id', () => {
    it('소유자가 인증되었을 때 상품을 수정해야 함', async () => {
      const { user, accessToken } = await createTestUser();
      const product = await createTestProduct(user.id);

      const updateData = {
        name: 'Updated Product',
        price: 50000,
      };

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.description).toBe(product.description); // unchanged
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      const updateData = {
        name: 'Updated Product',
      };

      await request(app)
        .patch(`/products/${product.id}`)
        .send(updateData)
        .expect(401);
    });

    it('사용자가 소유자가 아닐 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken: otherUserToken } = await createTestUser({
        email: 'other@example.com',
      });
      const product = await createTestProduct(owner.id);

      const updateData = {
        name: 'Updated Product',
      };

      await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(otherUserToken)])
        .send(updateData)
        .expect(403);
    });

    it('상품이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      const updateData = {
        name: 'Updated Product',
      };

      await request(app)
        .patch('/products/999999')
        .set('Cookie', [getAuthCookie(accessToken)])
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('소유자가 인증되었을 때 상품을 삭제해야 함', async () => {
      const { user, accessToken } = await createTestUser();
      const product = await createTestProduct(user.id);

      await request(app)
        .delete(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(204);

      // Verify product is deleted
      await request(app).get(`/products/${product.id}`).expect(404);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      await request(app).delete(`/products/${product.id}`).expect(401);
    });

    it('사용자가 소유자가 아닐 때 실패해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken: otherUserToken } = await createTestUser({
        email: 'other@example.com',
      });
      const product = await createTestProduct(owner.id);

      await request(app)
        .delete(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(otherUserToken)])
        .expect(403);
    });

    it('상품이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      await request(app)
        .delete('/products/999999')
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(404);
    });
  });

  describe('POST /products/:id/favorites', () => {
    it('인증되었을 때 상품을 찜 목록에 추가해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { accessToken } = await createTestUser({ email: 'user@example.com' });
      const product = await createTestProduct(owner.id);

      await request(app)
        .post(`/products/${product.id}/favorites`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(201);

      // Verify favorite was added
      const response = await request(app)
        .get(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(200);

      expect(response.body.favoriteCount).toBe(1);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      await request(app).post(`/products/${product.id}/favorites`).expect(401);
    });

    it('상품이 존재하지 않을 때 실패해야 함', async () => {
      const { accessToken } = await createTestUser();

      await request(app)
        .post('/products/999999/favorites')
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(404);
    });
  });

  describe('DELETE /products/:id/favorites', () => {
    it('인증되었을 때 상품을 찜 목록에서 제거해야 함', async () => {
      const { user: owner } = await createTestUser();
      const { user: favUser, accessToken } = await createTestUser({
        email: 'user@example.com',
      });
      const product = await createTestProduct(owner.id);

      // First add to favorites
      await request(app)
        .post(`/products/${product.id}/favorites`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(201);

      // Then remove from favorites
      await request(app)
        .delete(`/products/${product.id}/favorites`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(204);

      // Verify favorite was removed
      const response = await request(app)
        .get(`/products/${product.id}`)
        .set('Cookie', [getAuthCookie(accessToken)])
        .expect(200);

      expect(response.body.favoriteCount).toBe(0);
    });

    it('인증되지 않았을 때 실패해야 함', async () => {
      const { user } = await createTestUser();
      const product = await createTestProduct(user.id);

      await request(app).delete(`/products/${product.id}/favorites`).expect(401);
    });
  });
});
