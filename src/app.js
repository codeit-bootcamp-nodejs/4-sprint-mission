import express from "express";

import articleRouter from "./routes/article_router.js";
import productRouter from "./routes/product_router.js";

const app = express();
app.use(express.json());

app.use("/article", articleRouter);
app.use("/product", productRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`서버 실행됨: http://localhost:${port}`);
});
