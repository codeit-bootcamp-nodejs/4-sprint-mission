import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';

import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRouter from "./routes/user.route.js";
import productRouter from './routes/product.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import likeRouter from './routes/like.route.js';


const prisma = new PrismaClient();

dotenv.config();

const app: Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);

// async function checkDB() {
//   try {
//     const users = await prisma.user.findMany();
//     console.log("DB users:", users);
//   } catch (err) {
//     console.error("DB 연결 오류:", err);
//   }
// }

// checkDB();

app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("🚀 서버 실행 중: http://localhost:3000");
});

