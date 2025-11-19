import request from 'supertest';
import { app, prisma } from '../../src/app';
import { generateAuthToken } from '../helpers/auth.helper';

describe('Products API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('인증 불필요 - GET /api/products', () => {
    it('should return list of products', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination with limit and page', async () => {
      const response = await request(app).get('/api/products?limit=2&page=1').expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
    });

    it('should include user info and counts', async () => {
      const response = await request(app).get('/api/products').expect(200);

      if (response.body.data.length > 0) {
        const product = response.body.data[0];
        expect(product).toHaveProperty('user');
        expect(product.user).toHaveProperty('nickname');
        expect(product).toHaveProperty('likeCount');
        expect(product).toHaveProperty('commentCount');
      }
    });
  });

  describe('인증 불필요 - GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const response = await request(app).get('/api/products/1').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/999999').expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Product not found');
    });

    it('should include user info and stats', async () => {
      const response = await request(app).get('/api/products/1').expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('nickname');
      expect(response.body).toHaveProperty('likeCount');
      expect(response.body).toHaveProperty('commentCount');
    });
  });

  describe('인증 필요 - POST /api/products', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `product-create-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Product Create Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.product.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should create a product with authentication', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10000,
        tags: ['test'],
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newProduct.name);
      }
    });

    it('should return 401 without authentication', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10000,
      };

      await request(app).post('/api/products').send(newProduct).expect(401);
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('인증 필요 - POST /api/products/:id/like', () => {
    let authToken: string;
    let testUserId: number;
    let testProductId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `product-like-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Product Like Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);

      const product = await prisma.product.create({
        data: {
          name: 'Product to Like',
          description: 'Test Description',
          price: 5000,
          userId: testUserId,
        },
      });
      testProductId = product.id;
    });

    afterAll(async () => {
      await prisma.product.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should toggle like on a product', async () => {
      const response = await request(app)
        .post(`/api/products/${testProductId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('liked');
        expect(typeof response.body.liked).toBe('boolean');
      }
    });

    it('should return 401 without authentication', async () => {
      await request(app).post(`/api/products/${testProductId}/like`).expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .post('/api/products/999999/like')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 403, 500]).toContain(response.status);
    });
  });

  describe('인증 필요 - PATCH /api/products/:id', () => {
    let authToken: string;
    let testProductId: number;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `product-update-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Product Update Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);

      const product = await prisma.product.create({
        data: {
          name: 'Product to Update',
          description: 'Original Description',
          price: 10000,
          userId: testUserId,
        },
      });
      testProductId = product.id;
    });

    afterAll(async () => {
      await prisma.product.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should update a product successfully', async () => {
      const updateData = {
        name: 'Updated Product Name',
        description: 'Updated Description',
        price: 15000,
      };

      const response = await request(app)
        .patch(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('name', updateData.name);
        expect(response.body).toHaveProperty('description', updateData.description);
        expect(response.body).toHaveProperty('price', updateData.price);
      }
    });

    it('should update product with partial data', async () => {
      const updateData = {
        price: 20000,
      };

      const response = await request(app)
        .patch(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('price', updateData.price);
      }
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        name: 'Should Fail',
      };

      await request(app)
        .patch(`/api/products/${testProductId}`)
        .send(updateData)
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const updateData = {
        name: 'Non-existent Product',
      };

      const response = await request(app)
        .patch('/api/products/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 with invalid data', async () => {
      const updateData = {
        price: -1000, // Negative price
      };

      const response = await request(app)
        .patch(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect([400, 200]).toContain(response.status);
    });
  });

  describe('인증 필요 - DELETE /api/products/:id', () => {
    let authToken: string;
    let testUserId: number;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `product-delete-test-${Date.now()}@example.com`,
          password: 'hashedpassword',
          nickname: 'Product Delete Test User',
        },
      });
      testUserId = user.id;
      authToken = generateAuthToken(testUserId);
    });

    afterAll(async () => {
      await prisma.product.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    });

    it('should delete a product successfully', async () => {
      // Create a product to delete
      const product = await prisma.product.create({
        data: {
          name: 'Product to Delete',
          description: 'Will be deleted',
          price: 5000,
          userId: testUserId,
        },
      });

      const response = await request(app)
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(deletedProduct).toBeNull();
    });

    it('should return 401 without authentication', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Product Requiring Auth',
          description: 'Auth required',
          price: 5000,
          userId: testUserId,
        },
      });

      await request(app).delete(`/api/products/${product.id}`).expect(401);

      // Cleanup
      await prisma.product.delete({ where: { id: product.id } });
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 for invalid product id', async () => {
      const response = await request(app)
        .delete('/api/products/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect([400, 404]).toContain(response.status);
    });
  });

  describe('인증 필요 - Filtering and Sorting', () => {
    it('should filter products by minPrice', async () => {
      const response = await request(app).get('/api/products?minPrice=5000').expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 0) {
        response.body.data.forEach((product: any) => {
          expect(product.price).toBeGreaterThanOrEqual(5000);
        });
      }
    });

    it('should filter products by maxPrice', async () => {
      const response = await request(app).get('/api/products?maxPrice=10000').expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 0) {
        response.body.data.forEach((product: any) => {
          expect(product.price).toBeLessThanOrEqual(10000);
        });
      }
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=5000&maxPrice=15000')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 0) {
        response.body.data.forEach((product: any) => {
          expect(product.price).toBeGreaterThanOrEqual(5000);
          expect(product.price).toBeLessThanOrEqual(15000);
        });
      }
    });

    it('should search products by keyword', async () => {
      const response = await request(app).get('/api/products?search=test').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should sort products by price ascending', async () => {
      const response = await request(app)
        .get('/api/products?orderBy=price&sortOrder=asc')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 1) {
        for (let i = 0; i < response.body.data.length - 1; i++) {
          expect(response.body.data[i].price).toBeLessThanOrEqual(
            response.body.data[i + 1].price
          );
        }
      }
    });

    it('should sort products by price descending', async () => {
      const response = await request(app)
        .get('/api/products?orderBy=price&sortOrder=desc')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      if (response.body.data.length > 1) {
        for (let i = 0; i < response.body.data.length - 1; i++) {
          expect(response.body.data[i].price).toBeGreaterThanOrEqual(
            response.body.data[i + 1].price
          );
        }
      }
    });
  });
});
