import express from "express";
import dotenv from "dotenv";

import productRouter from "./routes/product.js";    
import articleRouter from "./routes/article.js";       
import commentRouter from "./routes/comment.js";     a

dotenv.config();

const app = express();
app.use(express.json());

// 라우터 등록
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);a
app.listen(5432, () => {
    console.log('서버가 준비 되었습니다.')
})