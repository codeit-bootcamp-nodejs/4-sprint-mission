import { testRequest, expectSuccess } from '../helpers/testUtils.js';
import { cleanDatabase, setupTestDatabase, closeDatabase } from '../setup/testDatabase.js';
import { createTestUser, createTestProduct, createTestComment } from '../helpers/dataFactory.js';

describe('상품 공개 API (인증 불필요)', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('GET /products', () => {
        it('상품이 없을 때 빈 배열을 반환해야 함', async () => {
            const response = await testRequest.get('/products');

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });

        it('모든 상품을 반환해야 함', async () => {
            const user = await createTestUser();
            const product1 = await createTestProduct(user.id, { name: 'Product 1' });
            const product2 = await createTestProduct(user.id, { name: 'Product 2' });

            const response = await testRequest.get('/products');

            expectSuccess(response, 200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toMatchObject({
                id: product1.id,
                name: 'Product 1',
            });
            expect(response.body.data[1]).toMatchObject({
                id: product2.id,
                name: 'Product 2',
            });
        });

        it('소유자 정보와 함께 상품을 반환해야 함', async () => {
            const user = await createTestUser({ nickname: 'TestOwner' });
            await createTestProduct(user.id);

            const response = await testRequest.get('/products');

            expectSuccess(response, 200);
            expect(response.body.data[0]).toHaveProperty('user');
            expect(response.body.data[0].user.nickname).toBe('TestOwner');
        });
    });

    describe('GET /products/:id/comments', () => {
        it('댓글이 없을 때 빈 배열을 반환해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);

            const response = await testRequest.get(`/products/${product.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });

        it('상품의 모든 댓글을 반환해야 함', async () => {
            const user = await createTestUser();
            const product = await createTestProduct(user.id);
            await createTestComment(user.id, 'product', product.id, 'Comment 1');
            await createTestComment(user.id, 'product', product.id, 'Comment 2');

            const response = await testRequest.get(`/products/${product.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].content).toBe('Comment 1');
            expect(response.body.data[1].content).toBe('Comment 2');
        });

        it('작성자 정보와 함께 댓글을 반환해야 함', async () => {
            const user = await createTestUser({ nickname: 'CommentAuthor' });
            const product = await createTestProduct(user.id);
            await createTestComment(user.id, 'product', product.id, 'Test comment');

            const response = await testRequest.get(`/products/${product.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data[0]).toHaveProperty('userId');
            expect(response.body.data[0].userId).toBe(user.id);
        });

        it('존재하지 않는 상품의 댓글 조회시 빈 배열을 반환해야 함', async () => {
            const response = await testRequest.get('/products/99999/comments');

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });
    });
});
