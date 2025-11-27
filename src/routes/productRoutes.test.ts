import request from 'supertest';
import app from '../app';
import { prisma } from '../utils/prisma';
import { clearDatabase } from '../utils/testUtils';

describe('Product API Integration Tests', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Public Endpoints (No Authentication Required)', () => {
    describe('GET /products', () => {
      beforeEach(async () => {
        const user = await prisma.user.create({
          data: {
            email: 'productowner@test.com',
            password: 'hashedpass',
            nickname: 'Product Owner',
          },
        });

        for (let i = 1; i <= 15; i++) {
          await prisma.product.create({
            data: {
              name: `Product ${i}`,
              description: `Description for product ${i}`,
              price: 1000 * i,
              tags: ['electronics', 'test'],
              userId: user.id,
              createdAt: new Date(Date.now() - i * 1000),
            },
          });
        }
      });

      it('should retrieve all products with default pagination', async () => {
        const response = await request(app).get('/products');

        expect(response.status).toBe(200);
        expect(response.body.list).toHaveLength(10);
        expect(response.body.totalCount).toBe(15);
      });

      it('should support custom pagination parameters', async () => {
        const response = await request(app).get('/products?page=2&pageSize=5');

        expect(response.status).toBe(200);
        expect(response.body.list).toHaveLength(5);
        expect(response.body.list[0].name).toBe('Product 6');
      });

      it('should filter products by keyword', async () => {
        const response = await request(app).get('/products?keyword=Product 1');

        expect(response.status).toBe(200);
        expect(response.body.list.length).toBeGreaterThan(0);
        expect(response.body.list.every((p: any) => p.name.includes('1'))).toBe(true);
      });

      it('should sort products by creation date', async () => {
        const response = await request(app).get('/products?sortBy=recent');

        expect(response.status).toBe(200);
        expect(response.body.list[0].name).toBe('Product 1');
      });
    });

    describe('GET /products/:id', () => {
      it('should return product details when product exists', async () => {
        const user = await prisma.user.create({
          data: {
            email: 'owner@test.com',
            password: 'pass',
            nickname: 'Owner',
          },
        });

        const product = await prisma.product.create({
          data: {
            name: 'Test Product',
            description: 'A test product',
            price: 5000,
            tags: ['test'],
            userId: user.id,
          },
        });

        const response = await request(app).get(`/products/${product.id}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Test Product');
        expect(response.body.price).toBe(5000);
      });

      it('should return 404 when product does not exist', async () => {
        const response = await request(app).get('/products/99999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('Protected Endpoints (Authentication Required)', () => {
    describe('POST /products', () => {
      it('should return 401 for unauthenticated requests', async () => {
        const response = await request(app)
          .post('/products')
          .send({
            name: 'Unauthorized Product',
            description: 'Should fail',
            price: 1000,
            tags: ['test'],
          });

        expect(response.status).toBe(401);
      });

      it('should create product for authenticated user', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'creator@test.com',
          password: 'pass123',
          nickname: 'Creator',
        });

        await agent.post('/auth/login').send({
          email: 'creator@test.com',
          password: 'pass123',
        });

        const productData = {
          name: 'New Product',
          description: 'Created by authenticated user',
          price: 2000,
          tags: ['new', 'test'],
        };

        const response = await agent.post('/products').send(productData);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(productData.name);
        expect(response.body.price).toBe(productData.price);
      });
    });

    describe('PATCH /products/:id', () => {
      it('should allow owner to update their product', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'updater@test.com',
          password: 'pass123',
          nickname: 'Updater',
        });

        await agent.post('/auth/login').send({
          email: 'updater@test.com',
          password: 'pass123',
        });

        const createRes = await agent.post('/products').send({
          name: 'Original Name',
          description: 'Original Description',
          price: 1000,
          tags: ['original'],
        });

        const productId = createRes.body.id;

        const updateRes = await agent.patch(`/products/${productId}`).send({
          name: 'Updated Name',
          price: 1500,
        });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.name).toBe('Updated Name');
        expect(updateRes.body.price).toBe(1500);
      });

      it('should return 403 when non-owner tries to update', async () => {
        const owner = await prisma.user.create({
          data: {
            email: 'realowner@test.com',
            password: 'pass',
            nickname: 'Real Owner',
          },
        });

        const product = await prisma.product.create({
          data: {
            name: 'Owners Product',
            description: 'Description',
            price: 3000,
            tags: ['test'],
            userId: owner.id,
          },
        });

        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'attacker@test.com',
          password: 'pass123',
          nickname: 'Attacker',
        });

        await agent.post('/auth/login').send({
          email: 'attacker@test.com',
          password: 'pass123',
        });

        const response = await agent.patch(`/products/${product.id}`).send({
          name: 'Hacked Name',
        });

        expect(response.status).toBe(403);
      });
    });

    describe('DELETE /products/:id', () => {
      it('should allow owner to delete their product', async () => {
        const agent = request.agent(app);

        await agent.post('/auth/register').send({
          email: 'deleter@test.com',
          password: 'pass123',
          nickname: 'Deleter',
        });

        await agent.post('/auth/login').send({
          email: 'deleter@test.com',
          password: 'pass123',
        });

        const createRes = await agent.post('/products').send({
          name: 'To Be Deleted',
          description: 'Will be removed',
          price: 500,
          tags: ['delete'],
        });

        const productId = createRes.body.id;

        const deleteRes = await agent.delete(`/products/${productId}`);

        expect(deleteRes.status).toBe(200);

        const checkRes = await agent.get(`/products/${productId}`);
        expect(checkRes.status).toBe(404);
      });
    });
  });
});
