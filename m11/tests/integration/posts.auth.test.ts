import { testRequest, expectSuccess, expectError } from '../helpers/testUtils.js';
import { cleanDatabase, setupTestDatabase, closeDatabase } from '../setup/testDatabase.js';
import { createTestUser, createTestPost } from '../helpers/dataFactory.js';
import { createTestTokens, getAuthHeader } from '../helpers/authHelper.js';

describe('게시글 인증 API (인증 필요)', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /posts', () => {
        it('인증과 함께 게시글을 성공적으로 생성해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const postData = {
                title: 'New Post',
                content: 'Post content here',
            };

            const response = await testRequest
                .post('/posts')
                .set('Authorization', getAuthHeader(accessToken))
                .send(postData);

            expectSuccess(response, 201);
            expect(response.body.data).toMatchObject({
                title: postData.title,
                content: postData.content,
                userId: user.id,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const postData = {
                title: 'New Post',
                content: 'Post content',
            };

            const response = await testRequest.post('/posts').send(postData);

            expectError(response, 401);
        });

        it('제목이 누락되면 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest.post('/posts').set('Authorization', getAuthHeader(accessToken)).send({
                content: 'Post content',
            });

            expectError(response, 400);
        });

        it('내용이 누락되면 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest.post('/posts').set('Authorization', getAuthHeader(accessToken)).send({
                title: 'New Post',
            });

            expectError(response, 400);
        });
    });

    describe('GET /posts/:id', () => {
        it('인증과 함께 게시글 상세 정보를 성공적으로 조회해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .get(`/posts/${post.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
            expect(response.body.data).toMatchObject({
                id: post.id,
                title: post.title,
                content: post.content,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.get(`/posts/${post.id}`);

            expectError(response, 401);
        });

        it('존재하지 않는 게시글 조회시 실패해야 함', async () => {
            const user = await createTestUser();
            const { accessToken } = createTestTokens(user);

            const response = await testRequest.get('/posts/99999').set('Authorization', getAuthHeader(accessToken));

            expectError(response, 404);
        });
    });

    describe('PUT /posts/:id', () => {
        it('자신의 게시글을 성공적으로 수정해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            const updateData = {
                title: 'Updated Post',
                content: 'Updated content',
            };

            const response = await testRequest
                .put(`/posts/${post.id}`)
                .set('Authorization', getAuthHeader(accessToken))
                .send(updateData);

            expectSuccess(response, 200);
            expect(response.body.data).toMatchObject({
                id: post.id,
                title: updateData.title,
                content: updateData.content,
            });
        });

        it('다른 사용자의 게시글 수정시 실패해야 함', async () => {
            const author = await createTestUser({ email: 'author@example.com' });
            const otherUser = await createTestUser({ email: 'other@example.com' });
            const post = await createTestPost(author.id);
            const { accessToken } = createTestTokens(otherUser);

            const response = await testRequest
                .put(`/posts/${post.id}`)
                .set('Authorization', getAuthHeader(accessToken))
                .send({
                    title: 'Hacked Post',
                });

            expectError(response, 403);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.put(`/posts/${post.id}`).send({ title: 'Updated' });

            expectError(response, 401);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('자신의 게시글을 성공적으로 삭제해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .delete(`/posts/${post.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('다른 사용자의 게시글 삭제시 실패해야 함', async () => {
            const author = await createTestUser({ email: 'author@example.com' });
            const otherUser = await createTestUser({ email: 'other@example.com' });
            const post = await createTestPost(author.id);
            const { accessToken } = createTestTokens(otherUser);

            const response = await testRequest
                .delete(`/posts/${post.id}`)
                .set('Authorization', getAuthHeader(accessToken));

            expectError(response, 403);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.delete(`/posts/${post.id}`);

            expectError(response, 401);
        });
    });

    describe('POST /posts/:id/comments', () => {
        it('인증과 함께 댓글을 성공적으로 생성해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', getAuthHeader(accessToken))
                .send({ content: 'Great post!' });

            expectSuccess(response, 201);
            expect(response.body.data).toMatchObject({
                content: 'Great post!',
                userId: user.id,
                postId: post.id,
            });
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.post(`/posts/${post.id}/comments`).send({ content: 'Comment' });

            expectError(response, 401);
        });
    });

    describe('POST /posts/:id/likes', () => {
        it('게시글의 좋아요를 성공적으로 토글해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            const response = await testRequest
                .post(`/posts/${post.id}/likes`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('이미 좋아요한 경우 좋아요를 취소해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);
            const { accessToken } = createTestTokens(user);

            await testRequest.post(`/posts/${post.id}/likes`).set('Authorization', getAuthHeader(accessToken));

            const response = await testRequest
                .post(`/posts/${post.id}/likes`)
                .set('Authorization', getAuthHeader(accessToken));

            expectSuccess(response, 200);
        });

        it('인증 없이 실패해야 함', async () => {
            const user = await createTestUser();
            const post = await createTestPost(user.id);

            const response = await testRequest.post(`/posts/${post.id}/likes`);

            expectError(response, 401);
        });
    });
});
