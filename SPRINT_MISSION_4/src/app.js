import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import likeRoutes from "./routes/likes.routes.js";

import errorHandler from "./errors/errorHandler.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// 라우트 등록
app.use("/auth", authRoutes);
app.use("/me", userRoutes);
app.use("/products", productRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);

// 에러 핸들러
app.use(errorHandler);

export default app;
