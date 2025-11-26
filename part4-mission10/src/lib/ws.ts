import type { NotificationType as PrismaNotificationType } from '@prisma/client';
import { NotificationType as NotificationTypeValues } from '@prisma/client';
import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

import { parseUserIdFromToken } from './wsAuth.js';
import type { NotificationType as DomainNotificationType } from '../types/notification.js';

type UserSocketMap = Map<number, Set<string>>;
const userSockets: UserSocketMap = new Map();
let io: Server | undefined;

type AuthFn = (rawToken: unknown) => number | null;

export function __resetWsForTest() {
  userSockets.clear();
  io = undefined;
}
export function __getUserSocketsForTest() {
  return userSockets;
}

type WireNotificationType = 'contract-linked' | 'chat' | 'system';
export interface WireNotificationPayload {
  type: WireNotificationType;
  message: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

export function mapDomainToWire(
  t: PrismaNotificationType | DomainNotificationType
): WireNotificationType {
  switch (t) {
    case NotificationTypeValues.PRICE_CHANGE:
      return 'system';
    case NotificationTypeValues.NEW_COMMENT:
      return 'chat';
    default: {
      const _never: never = t as never;
      return 'system';
    }
  }
}

export function setupWebSocket(server: HTTPServer, deps?: { auth?: AuthFn }) {
  const auth = deps?.auth ?? parseUserIdFromToken;

  io = new Server(server, {
    path: '/ws',
    cors: {
      origin: [process.env.CORS_ORIGIN || 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const userId = auth(socket.handshake.auth?.token);
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    const set = userSockets.get(userId) ?? new Set<string>();
    set.add(socket.id);
    userSockets.set(userId, set);

    socket.emit('joined', { ok: true, userId });

    socket.on('disconnect', () => {
      const s = userSockets.get(userId);
      if (s) {
        s.delete(socket.id);
        if (s.size === 0) userSockets.delete(userId);
      }
    });
  });
}

// 알림 게이트웨이
export const wsGateway = {
  notifyUser(args: {
    userId: number;
    type: PrismaNotificationType | DomainNotificationType;
    message: string;
    createdAt?: Date;
    data?: Record<string, unknown>;
  }) {
    if (!io) return;

    const { userId, type, message, data } = args;
    const createdAt = (args.createdAt ?? new Date()).toISOString();
    const wire: WireNotificationPayload = {
      type: mapDomainToWire(type),
      message,
      createdAt,
      ...(data !== undefined ? { data } : {}),
    };

    const sockets = userSockets.get(userId);
    if (!sockets) return;

    for (const sid of sockets) {
      io.to(sid).emit('notification', wire);
    }
  },
};

// 전달받은 io를 실제로 사용 (전역 의존성 제거)
export function publishToUser(
  sio: Server,
  {
    userId,
    event,
    payload,
  }: { userId: number; event: 'notification'; payload: unknown }
) {
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  for (const sid of sockets) {
    sio.to(sid).emit(event, payload);
  }
}

export async function closeWebSocket(): Promise<void> {
  if (!io) return;

  // 1) 모든 소켓 강제 disconnect
  const sockets = await io.fetchSockets().catch(() => []);
  for (const s of sockets) {
    try {
      s.disconnect(true);
    } catch {}
  }

  // 2) io 자체 종료를 "완료"까지 대기
  await new Promise<void>((resolve) => {
    io!.close(() => resolve());
  });

  io = undefined;
}

// export type { UserSocketMap }; // (원하면)
