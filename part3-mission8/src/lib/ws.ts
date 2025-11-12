import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { parseUserIdFromToken } from './wsAuth.js';
import type { NotificationType as PrismaNotificationType } from '@prisma/client';
import { NotificationType as NotificationTypeValues } from '@prisma/client';
import type { NotificationType } from '../types/notification.js';
// 여러 기기 지원
type UserSocketMap = Map<number, Set<string>>;
const userSockets: UserSocketMap = new Map();
let io: Server;

// ── wire payload (클라이언트와 약속된 포맷)
type WireNotificationType = 'contract-linked' | 'chat' | 'system';
export interface WireNotificationPayload {
  type: WireNotificationType;
  message: string;
  createdAt: string; // ISO string
  data?: Record<string, unknown>;
}

// 도메인 → wire 매핑 (정책에 맞게 조정)
function mapDomainToWire(t: PrismaNotificationType): WireNotificationType {
  switch (t) {
    case NotificationTypeValues.PRICE_CHANGE:
      return 'system';
    case NotificationTypeValues.NEW_COMMENT:
      return 'chat';
    default: {
      // exhaustiveness 체크(컴파일 타임용)
      const _never: never = t;
      // 안전망 (원하면 throw로 바꿔도 됨)
      return 'system';
    }
  }
}

export function setupWebSocket(server: HTTPServer) {
  io = new Server(server, {
    path: '/ws',
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    const userId = parseUserIdFromToken(socket.handshake.auth?.token);
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    // 매핑 저장(여러 소켓)
    const set = userSockets.get(userId) ?? new Set<string>();
    set.add(socket.id);
    userSockets.set(userId, set);

    socket.on('disconnect', () => {
      const s = userSockets.get(userId);
      if (s) {
        s.delete(socket.id);
        if (s.size === 0) userSockets.delete(userId);
      }
    });
  });
}

// notificationService에서 호출할 함수(도메인 타입을 받아 wire로 변환)
export const wsGateway = {
  notifyUser(args: {
    userId: number;
    type: NotificationType; // 도메인 enum
    message: string;
    createdAt?: Date; // 생략 시 now
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

export function publishToUser(
  _io: Server,
  {
    userId,
    event,
    payload,
  }: { userId: number; event: 'notification'; payload: unknown }
) {
  if (!io) return;
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  for (const sid of sockets) {
    io.to(sid).emit(event, payload);
  }
}
