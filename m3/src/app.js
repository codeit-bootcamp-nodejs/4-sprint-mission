import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import always from './core/middlewares/always.js';
import prisma from './core/client/prismaClient.js';
import productRouter from './routes/products.js';
import articleRouter from './routes/articles.js';
import commentRouter from './routes/comments.js';
import uploadsRouter from './routes/uploads.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

app.use(always);

// `/files` 경로로 정적 파일을 제공합니다.
app.use('/files', express.static('uploads'));

// Products API 및 Products 댓글 API 라우터
app.use('/products', productRouter);

// Articles API 및 Articles 댓글 API 라우터
app.use('/articles', articleRouter);

// 모든 댓글에 대한 범용적인 라우트 연결
app.use('/comments', commentRouter);

// 파일 업로드 API. `/uploads` 경로를 통해 파일을 업로드합니다.
app.use('/uploads', uploadsRouter);

// 모든 라우터가 처리하지 못한 요청에 대한 404 Not Found 핸들러
// 이 미들웨어는 항상 가장 마지막에 위치해야 합니다. (와일드카드 '*')
app.all(/(.*)/, (req, res) => {
  res.status(404).send({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 애플리케이션 종료 시 Prisma 클라이언트 연결 해제 (선택 사항이지만 권장)
process.on('beforeExit', async () => {
  console.log('Server is shutting down. Disconnecting from database...');
  await prisma.$disconnect();
});
