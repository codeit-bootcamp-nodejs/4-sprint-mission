import { testRequest, expectSuccess, expectError } from '../helpers/testUtils.js';
import { cleanDatabase, setupTestDatabase, closeDatabase } from '../setup/testDatabase.js';
import { createTestUser, createTestProduct } from '../helpers/dataFactory.js';
import { createTestTokens, getAuthHeader } from '../helpers/authHelper.js';

describe('상품 인증 API (인증 필요)', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /products', () => {
        it('인증과 함께 상품을 성공적으로 생성해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const productData = {
                name: 'New Product',
                description: 'Product description',
                price: 50000,
                tags: ['tag1', 'tag2'],
            };

            const response = await testRequest
                .post('/products')
                .set('Authorization', getAuthHeader(accessToken))
                .send(productData);

            expectSuccess(response, 201);
            expect(response.body.data).toMatchObject({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                userId: user.id,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const productData = {
                name: 'New Product',
                description: 'Product description',
                price: 50000,
                tags: ['tag1'],
            };

            const response = await testRequest.post('/products').send(productData);

            expectError(response, 401);
        });

        it('이름이 누락되면 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .post('/products')
                .set('Authorization', getAuthHeader(accessToken))
                .send({
                    description: 'Product description',
                    price: 50000,
                    tags: ['tag1'],
                });

            expectError(response, 400);
        });

        it('태그가 누락되면 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest.post('/products').set('Authorization', getAuthHeader(accessToken)).send({
                name: 'New Product',
                description: 'Product description',
                price: 50000,
            });

            expectError(response, 400);
        });
    });

    describe('GET /products/:id', () => {
        it('인증과 함께 상품 상세 정보를 성공적으로 조회해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .get(`/products/${product.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
            expect(response.body.data).toMatchObject({
                id: product.id,
                name: product.name,
                description: product.description,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.get(`/products/${product.id}`);

            expectError(response, 401);
        });

        it('존재하지 않는 상품 조회시 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest.get('/products/99999').set('Authorization', getAuthHeader(accessToken));

            expectError(response, 404);
        });
    });

    describe('PUT /products/:id', () => {
        it('자신의 상품을 성공적으로 수정해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            const updateData = {
                name: 'Updated Product',
                description: 'Updated description',
                price: 60000,
                tags: ['updated'],
            };

            const response = await testRequest
                .put(`/products/${product.id}`)
                .set('Authorization', getAuthHeader(accessToken))
                .send(updateData);

            expectSuccess(response, 200);
            expect(response.body.data).toMatchObject({
                id: product.id,
                name: updateData.name,
                description: updateData.description,
                price: updateData.price,
            });
        });

        it('다른 사용자의 상품 수정시 실패해야 함', async () => {
            const owner = await createTestUser({ email: 'owner@example.com' });
            const otherUser = await createTestUser({ email: 'other@example.com' });
            const product = await createTestProduct(owner.id);
            const { accessToken } = createTestTokens(otherUser);

            const response = await testRequest
                .put(`/products/${product.id}`)
                .set('Authorization', getAuthHeader(accessToken))
                .send({
                    name: 'Hacked Product',
                });

            expectError(response, 403);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.put(`/products/${product.id}`).send({ name: 'Updated' });

            expectError(response, 401);
        });
    });

    describe('DELETE /products/:id', () => {
        it('자신의 상품을 성공적으로 삭제해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .delete(`/products/${product.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('다른 사용자의 상품 삭제시 실패해야 함', async () => {
            const owner = await createTestUser({ email: 'owner@example.com' });
            const otherUser = await createTestUser({ email: 'other@example.com' });
            const product = await createTestProduct(owner.id);
            const { accessToken } = createTestTokens(otherUser);

            const response = await testRequest
                .delete(`/products/${product.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectError(response, 403);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.delete(`/products/${product.id}`);

            expectError(response, 401);
        });
    });

    describe('POST /products/:id/comments', () => {
        it('인증과 함께 댓글을 성공적으로 생성해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .post(`/products/${product.id}/comments`)
                .set('Authorization', getAuthHeader(accessToken))
                .send({ content: 'Great product!' });

            expectSuccess(response, 201);
            expect(response.body.data).toMatchObject({
                content: 'Great product!',
                userId: user.id,
                productId: product.id,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.post(`/products/${product.id}/comments`).send({ content: 'Comment' });

            expectError(response, 401);
        });
    });

    describe('POST /products/:id/likes', () => {
        it('상품의 좋아요를 성공적으로 토글해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .post(`/products/${product.id}/likes`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('이미 좋아요한 경우 좋아요를 취소해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            const { accessToken } = createTestTokens(user);

            await testRequest.post(`/products/${product.id}/likes`).set('Authorization', getAuthHeader(accessToken));

            const response = await testRequest
                .post(`/products/${product.id}/likes`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.post(`/products/${product.id}/likes`);

            expectError(response, 401);
        });
    });
});
