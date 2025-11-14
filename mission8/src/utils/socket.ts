import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import { appConfig } from '../config/app.config.js';
import { authConfig } from '../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../constants/constant.js';
import { HttpException } from './http-exception.js';
import logger from './logger.js';

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: appConfig.cors_origin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth['token'];

    if (!token) {
      throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidToken);
    }

    try {
      const decoded = jwt.verify(token, authConfig.accessTokenSecretKey) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      logger.error({ message: 'JWT 검증 실패', error: err });
      next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidToken));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);
    logger.info(`사용자 ${userId} 소켓 연결됨`);
    socket.on('disconnect', () => {
      logger.info(`사용자 ${userId} 소켓 연결 해제됨`);
    });
  });

  return io;
}
