import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routers/productsRouter.js";
import articleRouter from "./routers/articlesRouter.js";
import imageRouter from "./routers/imageRouter.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import notificationRouter from "./routers/notificationRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { PORT } from "./lib/constants.js";

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
