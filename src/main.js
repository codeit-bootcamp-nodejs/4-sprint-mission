import express from "express";
import ProductRouter from "./api/routes/ProductRouter.js";
import ArticleRouter from "./api/routes/ArticleRouter.js";
import CommentRouter from "./api/routes/CommentRouter.js";
import errorHandler from "./api/middlewares/errorHandler.js";
import imageRouter from "./api/routes/ImageRoute.js";
// import { testAllArticleService } from "./external/tests/testArticleService.js";
// import { testAllProductService } from "./external/tests/testProductService.js";

// //testAllArticleService();
// testAllProductService();

const app = express();
const port = 3000;

app.use(express.json());

app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use("/comments", CommentRouter);

app.use("/uploads", express.static("uploads"));
app.use("/images", imageRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
