import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// import router
import productRouter from './routes/products.router';
import articleRouter from './routes/articles.router';
import uploadRouter from './routes/upload.router';
import usersRouter from './routes/users.router';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// route settitng
app.use('/api', [productRouter, articleRouter, uploadRouter, usersRouter]);

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || '오류가 발생했습니다.';
  res.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번에서 실행중입니다.`);
});

export default prisma;
