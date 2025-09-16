import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routers/productsRouter.js";
import articleRouter from "./routers/articlesRouter.js";
import imageRouter from "./routers/imageRouter.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { PORT } from "./lib/constants.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/me", userRouter);
app.use("/photos", imageRouter);
app.use("/profile", express.static("/uploads"));
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
