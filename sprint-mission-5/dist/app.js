import express from "express";
import * as dotenv from "dotenv";
import ProductRouter from "./routers/product.js";
import ArticleRouter from "./routers/article.js";
import userRouter from "./routers/users.js";
import ErrorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import passports from "./lib/passport/index.js";
dotenv.config(); // .env 파일 환경변수 적재
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
app.use(passports.passport.initialize());
app.use("/users", userRouter);
app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use(ErrorHandler);
app.listen(PORT, () => {
    console.log("server running");
});
//# sourceMappingURL=app.js.map