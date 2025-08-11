import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

//라우터
import productRouter from './routes/product.routes.js';
import articleRouter from './routes/article.routes.js';
import articleCommentRouter from './routes/articleComment.routes.js';
import productCommentRouter from './routes/productComment.routes.js';
import articleCommentLikeRouter from './routes/articleCommentLike.routes.js';
import productCommentLikeRouter from './routes/productCommentLike.routes.js'
import postRouter from './routes/postRoutes.js';

// 에러 핸들러
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ESM 환경에서 _dirname 대체
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// 미들웨어
app.use(cors());
app.use(express.json());

// 정적 파일 서비스 설정 (이미지 접근 가능하도록)
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

// 라우터
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/article-comments', articleCommentRouter);
app.use('/product-comments', productCommentRouter);
app.use('/article-comment-likes', articleCommentLikeRouter);
app.use('/product-comment-likes', productCommentLikeRouter);
app.use('/posts', postRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('서버 실행 중!');
  });

// 에러 핸들러
app.use(errorHandler);


// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 서버가 http://localhost:${PORT} 에서 실행 중`);
});