import express from "express";
import cookieParser from "cookie-parser";

import articleRouter from "./routes/article_router";
import productRouter from "./routes/product_router";
import loginRouter from "./routes/login_router";
import uploadRouter from "./routes/upload_router";
import userRouter from "./routes/user_router";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/article", articleRouter);
app.use("/product", productRouter);
app.use("/", loginRouter);
app.use("/uploads", uploadRouter);
app.use("/uploads", express.static("uploads"));
app.use("/user", userRouter);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`서버 실행됨: http://localhost:${port}`);
});
