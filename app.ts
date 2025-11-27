import express, { type Application } from "express";
import http from "http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { parse } from "url";
import session from "express-session";
import passport from "./config/passport.config.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

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

// ESM 환경에서 __dirname, __filename 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/like", likeRouter);
app.use("/api/notification", notificationRouter);

app.get('/', (req, res) => {
  res.send('서버 정상 동작!');
});

app.use("/auth", googleauthRouter);

app.use(errorHandler);

const server = http.createServer(app);

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
    console.log(`User ${userId} disconnected`);
  });
});

export function sendNotificationToUser(userId: number, notification: any) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ event: "notification", data: notification }));
  }
}

const PORT: number = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
  });
}

export { app, server };
