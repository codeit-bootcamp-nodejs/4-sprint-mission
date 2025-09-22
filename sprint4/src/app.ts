// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';

// 환경 변수 로드
dotenv.config();

const app: Application = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.send('API 서버가 실행 중입니다.');
});

// 에러 핸들링 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

export default app;