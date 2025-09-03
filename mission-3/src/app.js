import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routes/products.router.js";
import articlesRouter from "./routes/articles.router.js";
import uploadsRouter from "./routes/uploads.router.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); //CORS 설정
app.use(express.json()); //JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

import { errorHandler } from "./middlewares/error-handler.middleware.js";

app.use('/api/products', productsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/uploads', uploadsRouter);

// uploads 폴더의 파일을 정적으로 제공
app.use('/uploads', express.static('uploads'));

// 에러 핸들러 미들웨어 등록
app.use(errorHandler);


//서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});