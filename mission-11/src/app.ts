import 'dotenv/config';
import { validateEnv } from './utils/env.util.js';
validateEnv(); // 애플리케이션 시작 전 환경 변수 검증

import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import http from 'http'; // Import http module
import { Server } from 'socket.io'; // Import Server from socket.io
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for socket authentication

import usersRouter from "./routes/users.router.js";
import productsRouter from './routes/products.router.js';
import articlesRouter from './routes/articles.router.js';
import commentsRouter from './routes/comments.router.js';
import notificationsRouter from './routes/notifications.router.js'; // Import notifications router
import { NotificationsService } from './services/notifications.service.js'; // Import NotificationsService

// uploads 폴더가 존재하지 않으면, 폴더를 생성합니다.
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

export const app = express();
export const httpServer = http.createServer(app); // Create http server
export const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for now, refine later
    methods: ["GET", "POST"]
  }
}); // Initialize socket.io

const notificationsService = NotificationsService.getInstance(); // Get singleton instance
notificationsService.setIo(io); // Pass io instance to service

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET_KEY!;

app.use(express.json()); //body-parser middleware
app.use('/api', [usersRouter, productsRouter, articlesRouter, commentsRouter, notificationsRouter]); // Add notifications router

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(`[${req.method}] ${req.originalUrl} :`, err);
    res.status(500).json({ message: "서버 내부 오류 발생"});
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token.'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.userId}`);
  // Join a room specific to the user's ID
  socket.join(socket.data.userId.toString());

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.data.userId}`);
  });
});

// Only listen if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => { // Listen on http server
      console.log(PORT, "포트로 서버 실행중");
  });
}