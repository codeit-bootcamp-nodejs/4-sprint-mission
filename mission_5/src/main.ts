import path from "path";

import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./router/productRouter.js";
import articleRouter from "./router/articleRouter.js";
import imageRouter from "./router/imageRouter.js";
import userRouter from "./router/userRouter.js";

import errorHandler from "./handler/errorHandler.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
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
app.use(userRouter);

app.use(errorHandler);
app.use("/upload", express.static(path.resolve("uploads")));

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
