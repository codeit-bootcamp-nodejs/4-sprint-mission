import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from './token';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

let io: SocketIOServer | null = null;

/** Socket.IO 서버 초기화 */
export const initSocketIO = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // JWT 인증 미들웨어
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // 연결 이벤트
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User ${socket.userId} connected`);

    // 사용자별 룸에 참여
    socket.join(`user:${socket.userId}`);

    // 연결 해제 이벤트
    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  });

  return io;
};

/** Socket.IO 인스턴스 가져오기 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
