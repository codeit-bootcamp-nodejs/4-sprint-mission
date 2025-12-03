import { testRequest, expectSuccess } from '../helpers/testUtils.js';
import { cleanDatabase, setupTestDatabase, closeDatabase } from '../setup/testDatabase.js';
import { createTestUser, createTestPost, createTestComment } from '../helpers/dataFactory.js';

describe('게시글 공개 API (인증 불필요)', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('GET /posts', () => {
        it('게시글이 없을 때 빈 배열을 반환해야 함', async () => {
            const response = await testRequest.get('/posts');

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });

        it('모든 게시글을 반환해야 함', async () => {
            const user = await createTestUser();
            const post1 = await createTestPost(user.id, { title: 'Post 1' });
            const post2 = await createTestPost(user.id, { title: 'Post 2' });

            const response = await testRequest.get('/posts');

            expectSuccess(response, 200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toMatchObject({
                id: post1.id,
                title: 'Post 1',
            });
            expect(response.body.data[1]).toMatchObject({
                id: post2.id,
                title: 'Post 2',
            });
        });

        it('작성자 정보와 함께 게시글을 반환해야 함', async () => {
            const user = await createTestUser({ nickname: 'PostAuthor' });
            await createTestPost(user.id);

            const response = await testRequest.get('/posts');

            expectSuccess(response, 200);
            expect(response.body.data[0]).toHaveProperty('user');
            expect(response.body.data[0].user.nickname).toBe('PostAuthor');
        });
    });

    describe('GET /posts/:id/comments', () => {
        it('댓글이 없을 때 빈 배열을 반환해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.get(`/posts/${post.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });

        it('게시글의 모든 댓글을 반환해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            await createTestComment(user.id, 'post', post.id, 'Comment 1');
            await createTestComment(user.id, 'post', post.id, 'Comment 2');

            const response = await testRequest.get(`/posts/${post.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].content).toBe('Comment 1');
            expect(response.body.data[1].content).toBe('Comment 2');
        });

        it('작성자 정보와 함께 댓글을 반환해야 함', async () => {
            const user = await createTestUser({ nickname: 'CommentAuthor' });
            const post = await createTestPost(user.id);
            await createTestComment(user.id, 'post', post.id, 'Test comment');

            const response = await testRequest.get(`/posts/${post.id}/comments`);

            expectSuccess(response, 200);
            expect(response.body.data[0]).toHaveProperty('userId');
            expect(response.body.data[0].userId).toBe(user.id);
        });

        it('존재하지 않는 게시글의 댓글 조회시 빈 배열을 반환해야 함', async () => {
            const response = await testRequest.get('/posts/99999/comments');

            expectSuccess(response, 200);
            expect(response.body.data).toEqual([]);
        });
    });
});
