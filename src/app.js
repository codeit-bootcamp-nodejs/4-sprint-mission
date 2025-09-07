import express from "express";
import cookieParser from "cookie-parser";

import articleRouter from "./routes/article_router.js";
import productRouter from "./routes/product_router.js";
import userRouter from "./routes/user_router.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/article", articleRouter);
app.use("/product", productRouter);
app.use("/", userRouter);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`서버 실행됨: http://localhost:${port}`);
});
