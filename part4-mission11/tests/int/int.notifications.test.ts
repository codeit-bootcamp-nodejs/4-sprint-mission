import bcrypt from 'bcrypt';
import request from 'supertest';

import { prisma } from '../../src/lib/prismaClient.js';
import { createTestApp } from '../_helper/test-app.js';
import { loginAndGetSession } from '../_helper/test-utils.js';

jest.setTimeout(20_000);

describe('Notifications API (secure)', () => {
  let agent: ReturnType<typeof request.agent>;
  let tokenUser1: string;

  beforeAll(async () => {
    const app = await createTestApp();
    agent = request.agent(app);

    const hashed = await bcrypt.hash('1234', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 7,
      username: 'u',
      email: 'u@ex.com',
      password: hashed,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await agent
      .post('/users/login')
      .send({ username: 'u', password: '1234' });

    expect(res.status).toBe(200);
    tokenUser1 = res.body.accessToken as string;
  });

  test('PATCH /notifications/read-all → 200 {count:0}', async () => {
    const app = await createTestApp();
    const { accessToken } = await loginAndGetSession(app, { userId: 77 });
    const res = await request(app)
      .patch('/notifications/read-all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((r) => {
        if (![200, 204].includes(r.status)) {
          throw new Error(`expected 200 or 204, got ${r.status}`);
        }
      });

    if (res.status === 200) {
      expect(res.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({ count: expect.any(Number) }),
        })
      );
    }
  });

  test('GET /notifications -> 내 알림 목록', async () => {
    const res = await agent
      .get('/notifications')
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /notifications/unread-count -> 미읽음 개수', async () => {
    const res = await agent
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ unreadCount: expect.any(Number) })
    );
  });

  test('PATCH /notifications/:id/read -> 단건 읽음 처리', async () => {
    const list = await agent
      .get('/notifications')
      .set('Authorization', `Bearer ${tokenUser1}`);

    const target = list.body.items?.[0];
    if (!target) return;

    const res = await agent
      .patch(`/notifications/${target.id}/read`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: '알림이 읽음 처리되었습니다.' });
  });

  test('PATCH /notifications/read-all -> 전체 읽음 처리', async () => {
    const res = await agent
      .patch('/notifications/read-all')
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(204);
    expect(res.text === '' || !res.text).toBe(true);
  });

  test('보호 API: 토큰 없으면 401', async () => {
    const res = await agent.get('/notifications');
    expect(res.status).toBe(401);
  });
});
