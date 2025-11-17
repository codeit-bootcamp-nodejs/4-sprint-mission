import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import createProductRouter from "./product.routes.js";
import createdArticleRouter from "./article.routes.js";
import createCommentRouter from "./comment.routes.js";
import notificationRouter from "./notification.routes/index.routes.js";
import type { Server as HttpServer } from "http";

const router = express.Router();

export default function createApiRouter(server: HttpServer) {
  router.use("/auth", authRouter);
  router.use("/user", userRouter);
  router.use("/product", createProductRouter(server));
  router.use("/article", createdArticleRouter(server));
  router.use("/comment", createCommentRouter(server));
  router.use("/notification", notificationRouter);
  return router;
}
