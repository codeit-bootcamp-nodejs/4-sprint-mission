import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import articleRouter from "./routes/article_router";
import productRouter from "./routes/product_router";
import loginRouter from "./routes/login_router";
import uploadRouter from "./routes/upload_router";
import userRouter from "./routes/user_router";
import notificationRouter from "./routes/notification_router";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

app.use("/article", articleRouter);
app.use("/product", productRouter);
app.use("/user", loginRouter);
app.use("/uploads", uploadRouter);
app.use("/uploads", express.static("uploads"));
app.use("/user", userRouter);
app.use("/:userId/notification", notificationRouter);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트 연결됨");

  socket.on("join", (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`유저 ${userId}가 방에 참여함`);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 종료됨");
  });
});

export function sendNotification(userId: number, message: string) {
  io.to(`user_${userId}`).emit("notification", { message });
}

const port = Number(process.env.PORT) || 3000;

// server.listen(port, () => {
//   console.log(`서버 실행됨: http://localhost:${port}`);
// });

export default app;
