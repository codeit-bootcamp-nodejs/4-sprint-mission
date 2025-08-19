import express from "express";
import * as dotenv from "dotenv";
import ProductRouter from "./routes/product.js";
import ArticleRouter from "./routes/article.js";
import ErrorHandler from "./middlewares/errorHandler.js";
import cors from "cors";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log("server running");
});
