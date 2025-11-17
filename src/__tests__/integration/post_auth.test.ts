//src/__tests__/integration/post_auth.test.ts
import request from 'supertest';
import app from '../../app';
import { clearDatabase, createTestUser, generateToken, prisma } from '../utils/test_helpers';

describe('Post API (Auth Required)', () => {
    let user: any;
    let token: string;

    beforeEach(async () => {
        await clearDatabase();
        user = await createTestUser({
            email: 'postauthor@test.com',
            nickname: '작성자',
            password: 'password123',
        });
        token = generateToken(user.id, user.email);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/posts', () => {
        it('인증된 사용자는 게시글을 작성할 수 있어야 함', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: '새 게시글',
                    content: '게시글 내용',
                });

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('새 게시글');
            expect(response.body.authorId).toBe(user.id);
        });

        it('인증 없이 게시글 작성 시 401을 반환해야 함', async () => {
            const response = await request(app)
                .post('/api/posts')
                .send({
                    title: '새 게시글',
                    content: '게시글 내용',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/posts/:id', () => {
        it('작성자는 게시글을 수정할 수 있어야 함', async () => {
            const post = await prisma.post.create({
                data: {
                    title: '수정할 게시글',
                    content: '내용',
                    authorId: user.id,
                },
            });

            const response = await request(app)
                .patch(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: '수정된 게시글',
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('수정된 게시글');
        });

        it('작성자가 아닌 경우 403을 반환해야 함', async () => {
            const otherUser = await createTestUser({
                email: 'other@test.com',
                nickname: '다른사용자',
                password: 'password123',
            });

            const post = await prisma.post.create({
                data: {
                    title: '다른 사람 게시글',
                    content: '내용',
                    authorId: otherUser.id,
                },
            });

            const response = await request(app)
                .patch(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: '수정 시도',
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/posts/:id', () => {
        it('작성자는 게시글을 삭제할 수 있어야 함', async () => {
            const post = await prisma.post.create({
                data: {
                    title: '삭제할 게시글',
                    content: '내용',
                    authorId: user.id,
                },
            });

            const response = await request(app)
                .delete(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);

            const deletedPost = await prisma.post.findUnique({
                where: { id: post.id },
            });
            expect(deletedPost).toBeNull();
        });
    });
});