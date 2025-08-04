import express from "express";
import ProductRouter from "./api/routes/ProductRouter.js";

// import { testAllArticleService } from "./external/tests/testArticleService.js";
// import { testAllProductService } from "./external/tests/testProductService.js";

// //testAllArticleService();
// testAllProductService();

const app = express();
const port = 3000;

app.use(express.json());

// /api 경로로 들어오는 요청은 ProductRouter가 처리합니다.
app.use("/products", ProductRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
