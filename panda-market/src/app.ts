import express from 'express';
import { businessErrorHandler } from '@/middlewares/errorHandlers/businessErrorHandler.js';
import cors from 'cors';
import morgan from 'morgan';
import '@/lib/redis.js';
import { prismaErrorHandler } from './middlewares/errorHandlers/prismaErrorHandler.js';
import { zodErrorHandler } from './middlewares/errorHandlers/zodErrorHandler.js';
import { catchAllErrorHandler } from './middlewares/errorHandlers/catchAllErrorHandler.js';
import articleRouter from '@/routers/articles.routes.js';
import productRouter from '@/routers/products.routes.js';
import fileRouter from '@/routers/images.routes.js';
import authRouter from '@/routers/auth.js';
import userRouter from '@/routers/user.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/article', articleRouter);
app.use('/product', productRouter);
app.use('/uploads', fileRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use(prismaErrorHandler);
app.use(zodErrorHandler);
app.use(businessErrorHandler);
app.use(catchAllErrorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
