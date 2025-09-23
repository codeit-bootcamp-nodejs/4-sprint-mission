import express from "express";
import ProductRouter from "./api/routes/product.router.js";
import ArticleRouter from "./api/routes/article.router.js";
import CommentRouter from "./api/routes/comment.router.js";
import errorHandler from "./api/middlewares/errorHandler.js";
import imageRouter from "./api/routes/image.router.js";
import AuthRouter from "./api/routes/auth.router.js";
import MypageRouter from "./api/routes/mypage.router.js";
import LikeRouter from "./api/routes/like.router.js";
import cookieParser from "cookie-parser";

// import { testAllArticleService } from "./external/tests/testArticleService.js";
// import { testAllProductService } from "./external/tests/testProductService.js";

// testAllArticleService();
// testAllProductService();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use("/comments", CommentRouter);
app.use("/mypage", MypageRouter);
app.use("/likes", LikeRouter);

app.use("/uploads", express.static("uploads"));
app.use("/images", imageRouter);
app.use("/auth", AuthRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
