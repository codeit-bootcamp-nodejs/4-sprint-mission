// config/socket.ts
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import { appConfig } from '../config/app.config.js';
import { authConfig } from '../config/auth.config.js';
import { HttpException } from './exception.js';

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: appConfig.cors_origin, credentials: true },
  });

  // socket 연결 시 JWT 인증
  io.use((socket, next) => {
    const token = socket.handshake.auth['token'];

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, authConfig.accessTokenSecretKey) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      console.log(err);
      next(new HttpException(300, 'test'));
    }
  });

  // 사용자별 room 입장
  io.on('connection', (socket) => {
    const userId = socket.data.userId;

    // 사용자 전용 room에 입장
    socket.join(`user:${userId}`);

    console.log(`User ${userId} connected`);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}
