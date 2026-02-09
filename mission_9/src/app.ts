import path from "path";
import http from "http";

import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./router/productRouter.js";
import articleRouter from "./router/articleRouter.js";
import imageRouter from "./router/imageRouter.js";
import notificationRouter from "./router/notificationRouter.js";
import userRouter from "./router/userRouter.js";
import { initializeSocket } from "./lib/socket.js";

import errorHandler from "./handler/errorHandler.js";

const app = express();
export const httpServer = http.createServer(app);

// Socket.IO 초기화
const io = initializeSocket(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(`User ${userId} joined room`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(cookieParser());

function logRequest(req: Request, _: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
}

// middleware for logging all http request
app.use(logRequest);

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/upload", imageRouter);
app.use(notificationRouter);
app.use(userRouter);

app.use(errorHandler);
app.use("/upload", express.static(path.resolve("uploads")));
