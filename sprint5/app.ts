import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routers/productsRouter";
import articleRouter from "./routers/articlesRouter";
import imageRouter from "./routers/imageRouter";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import notificationRouter from "./routers/notificationRouter";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/me", userRouter);
app.use("/photos", imageRouter);
app.use("/profile", express.static("/uploads"));
app.use("/auth", authRouter);
app.use("/notifications", notificationRouter);
app.use(errorHandler);

export default app;
