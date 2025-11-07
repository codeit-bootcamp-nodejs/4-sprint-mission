import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import container from "./container";
import productRouter from "./route/product-router";
import articleRouter from "./route/article-router";
import imageRouter from "./route/image-router";
import userRouter from "./route/user-router";
import notificationRouter from "./route/notification-router";
import { errorHandler } from "./middleware";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const {
  productController,
  articleController,
  commentController,
  imageController,
  userController,
  validationMiddleware,
  imageMiddleware,
} = container;

app.use(
  "/products",
  productRouter(productController, commentController, validationMiddleware)
);
app.use(
  "/articles",
  articleRouter(articleController, commentController, validationMiddleware)
);
app.use("/users", userRouter(userController));
app.use("/uploads", imageRouter(imageController, imageMiddleware));

app.use("/notifications", (req, res, next) => {
  notificationRouter(container.notificationController)(req, res, next);
});

app.use(errorHandler);

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // 실제 프로덕션에서는 클라이언트 주소로 제한필요
    methods: ["GET", "POST"],
  },
});

container.io = io;

io.on("connection", (socket) => {
  console.log(`[Socket.IO] a user connected: ${socket.id}`);

  socket.on("join_room", (userId: number) => {
    console.log(`[Socket.IO] User ${userId} joined room: user_room_${userId}`);
    socket.join(`user_room_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
