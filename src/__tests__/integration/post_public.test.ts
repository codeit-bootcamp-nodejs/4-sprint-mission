//src/__tests__/integration/post_public.test.ts
import request from 'supertest';
import app from '../../app';
import { clearDatabase, createTestUser, prisma } from '../utils/test_helpers';

describe('Post API (Public)', () => {
    let user: any;

    beforeEach(async () => {
        await clearDatabase();
        user = await createTestUser({
            email: 'author@test.com',
            nickname: '작성자',
            password: 'password123',
        });

        await prisma.post.createMany({
            data: [
                {
                    title: '테스트 게시글 1',
                    content: '내용 1',
                    authorId: user.id,
                },
                {
                    title: '테스트 게시글 2',
                    content: '내용 2',
                    authorId: user.id,
                },
            ],
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

  describe('GET /api/posts', () => {
    it('게시글 목록을 조회해야 함', async () => {
      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

    describe('GET /api/posts/:id', () => {
        it('특정 게시글을 조회해야 함', async () => {
            const post = await prisma.post.findFirst();

            expect(post).not.toBeNull();

            const response = await request(app).get(`/api/posts/${post!.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(post!.id);
            expect(response.body.title).toBe(post!.title);
        });

    it('존재하지 않는 게시글 조회 시 404를 반환해야 함', async () => {
      const response = await request(app).get('/api/posts/99999');

      expect(response.status).toBe(404);
    });
  });
});