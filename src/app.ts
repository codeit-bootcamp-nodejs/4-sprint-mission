import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

import container from "./container";
import productRouter from "./route/product-router";
import articleRouter from "./route/article-router";
import imageRouter from "./route/image-router";
import userRouter from "./route/user-router";
import notificationRouter from "./route/notification-router";
import { errorHandler } from "./middleware";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

const server = createServer(app); // http.Server 인스턴스

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

container.io = io; // 컨테이너에 io 주입

const {
  articleController,
  imageController,
  userController,
  validationMiddleware,
  imageMiddleware,
} = container;

app.use(
  "/products",
  productRouter(
    container.productController,
    container.commentController,
    validationMiddleware
  )
);
app.use(
  "/articles",
  articleRouter(
    articleController,
    container.commentController,
    validationMiddleware
  )
);
app.use("/users", userRouter(userController));
app.use("/uploads", imageRouter(imageController, imageMiddleware));

app.use("/notifications", (req, res, next) => {
  notificationRouter(container.notificationController)(req, res, next);
});

app.use(errorHandler);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("인증 오류: 토큰이 제공되지 않았습니다."));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("[Socket.IO] 인증 오류:", error.message);

      return next(new Error(`인증 오류: ${error.message}`));
    } else {
      console.error("[Socket.IO] 알 수 없는 인증 오류:", error);
      return next(new Error("인증 오류: 알 수 없는 오류가 발생했습니다."));
    }
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  if (!userId) {
    console.error("[Socket.IO] 인증 미들웨어를 통과했지만 userId가 없습니다.");
    socket.disconnect();
    return;
  }

  console.log(`[Socket.IO] User ${userId} connected: ${socket.id}`);

  const roomName = `user_room_${userId}`;
  socket.join(roomName);
  console.log(`[Socket.IO] User ${userId} joined room: ${roomName}`);

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] User ${userId} disconnected: ${socket.id}`);
  });
});

export default server;
