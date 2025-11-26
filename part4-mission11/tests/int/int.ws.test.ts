import { NotificationType as P } from '@prisma/client';
import { createServer } from 'http';
import type { AddressInfo } from 'net';
import { io as Client, type Socket } from 'socket.io-client';

import {
  setupWebSocket,
  wsGateway,
  closeWebSocket,
  __resetWsForTest,
  __getUserSocketsForTest,
} from '../../src/lib/ws.js';

/** ---- 타입 ---- */
type Wire = {
  type: 'system' | 'chat' | 'contract-linked';
  message: string;
  createdAt: string;
  data?: Record<string, unknown>;
};
type S2C = {
  joined: (v: { ok: boolean; userId: number }) => void;
  notification: (p: Wire) => void;
  error: (m: string) => void;
};
type C2S = Record<string, never>;

/** ---- 헬퍼 ---- */
const waitConnect = (s: Socket) =>
  new Promise<void>((res, rej) => {
    const ok = () => {
      cleanup();
      res();
    };
    const er = (e: unknown) => {
      cleanup();
      rej(e);
    };
    const cleanup = () => {
      s.off('connect', ok);
      s.off('connect_error', er as (e: Error) => void);
    };
    s.once('connect', ok);
    s.once('connect_error', er as (e: Error) => void);
  });

const onceNotification = (s: Socket<S2C, C2S>) =>
  new Promise<Wire>((resolve) => {
    const h = (p: Wire) => {
      s.off('notification', h);
      resolve(p);
    };
    s.on('notification', h);
  });

// 서버 내부 소켓맵에서 특정 userId의 연결 개수가 기대치가 될 때까지 대기
async function waitForServerSockets(
  userId: number,
  expectedCount: number,
  timeoutMs = 5000
) {
  const start = Date.now();
  // 폴링 주기 50ms
  while (Date.now() - start < timeoutMs) {
    const map = __getUserSocketsForTest();
    const set = map.get(userId);
    if (set && set.size === expectedCount) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(
    `userSockets(${userId}) did not reach ${expectedCount} within ${timeoutMs}ms`
  );
}

/** ---- 상태 초기화 ---- */
beforeEach(() => __resetWsForTest());
afterEach(async () => {
  await closeWebSocket();
  __resetWsForTest();
});

/** ---- 본 테스트 ---- */
test('setupWebSocket + wsGateway.notifyUser → client receives', async () => {
  const httpServer = createServer();
  httpServer.keepAliveTimeout = 0;
  httpServer.headersTimeout = 0;

  await new Promise<void>((r) => httpServer.listen(0, '127.0.0.1', r));
  const { port } = httpServer.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;

  setupWebSocket(httpServer, { auth: () => 99 });
  await new Promise((r) => setImmediate(r));

  const opts = {
    path: '/ws',
    auth: { token: 'T' },
    transports: ['websocket'],
    reconnection: false,
    forceNew: true,
    timeout: 4000,
  };

  const c1 = Client(base, opts) as unknown as Socket<S2C, C2S>;
  const c2 = Client(base, opts) as unknown as Socket<S2C, C2S>;

  try {
    await Promise.all([waitConnect(c1), waitConnect(c2)]);
    await waitForServerSockets(99, 2, 5000);

    const p = onceNotification(c2);
    wsGateway.notifyUser({ userId: 99, type: P.NEW_COMMENT, message: 'hi' });
    const got = await p;
    expect(got).toMatchObject({ message: 'hi' });
  } finally {
    c1.removeAllListeners();
    c2.removeAllListeners();
    c1.disconnect();
    c2.disconnect();
    await closeWebSocket();
    await new Promise<void>((r) => httpServer.close(() => r()));
  }
}, 20000);
