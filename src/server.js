import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.js';
import articlesRouter from './routes/articles.js';
import productCommentsRouter from './routes/productComments.js';
import articleCommentsRouter from './routes/articleComments.js';
import uploadRouter from './routes/uploads.js';

import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// 기본 미들웨어
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*'
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 업로드 폴더 제공
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, '../', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(staticDir));

// 라우트 (중복 제거: app.route는 개별 라우터 내부에서 사용)
app.use('/products', productsRouter);
app.use('/articles', articlesRouter);

// 댓글 라우트 분리 (중고마켓/자유게시판 각각)
app.use('/products/:productId/comments', (req, res, next) => productCommentsRouter(req, res, next));
app.use('/articles/:articleId/comments', (req, res, next) => articleCommentsRouter(req, res, next));

// 이미지 업로드
app.use('/upload', uploadRouter);

// 헬스체크
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// 에러 처리
app.use(notFound);
app.use(errorHandler);

// 서버 시작
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
