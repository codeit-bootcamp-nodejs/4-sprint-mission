import express, { type Application } from "express";
import http from "http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { parse } from "url";
import session from "express-session";
import passport from "./config/passport.config.js";

import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import notificationRouter from "./routes/notification.route.js";
import googleauthRouter from "./routes/googleauth.route.js";

dotenv.config();

const app: Application = express();

// 세션 설정 (OAuth를 위해 필요)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    },
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use("/notification", notificationRouter);

// Google OAuth 라우트 (사용자가 설정한 리디렉션 URI에 맞춤)
app.use("/auth", googleauthRouter);

//앱 모두 실행 후 글로벌 에러 핸들러 연결
app.use(errorHandler);

const server= http.createServer(app);

export const wss = new WebSocketServer({ server });
const clients = new Map<number, any>();

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url || "", true);
  const userId = Number(query.userId);

  if (!userId) {
    ws.close();
    return;
  }

  clients.set(userId, ws);
  console.log(`User ${userId} connected`);

  ws.on("close", () => {
    clients.delete(userId);
    console.log(`User ${userId} disconnected`)
  });
});

export function sendNotificationToUser(userId: number, notification:any) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ event: "notificiation", data: notification }));
  }
}

const PORT: number = Number(process.env.PORT) || 8080;

if (process.env.NODE_ENV !== "test") {
server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
}

// 테스트에서 사용할 수 있도록 export
export { app, server };
