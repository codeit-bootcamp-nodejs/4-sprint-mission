import express from 'express';
import router from '@routers/index.js';
import { businessErrorHandler } from '@/middlewares/errorHandlers/businessErrorHandler.js';
import cors from 'cors';
import morgan from 'morgan';
import '@lib/redis.js';
import { prismaErrorHandler } from './middlewares/errorHandlers/prismaErrorHandler.js';
import { zodErrorHandler } from './middlewares/errorHandlers/zodErrorHandler.js';
import { catchAllErrorHandler } from './middlewares/errorHandlers/catchAllErrorHandler.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(prismaErrorHandler);
app.use(zodErrorHandler);
app.use(businessErrorHandler);
app.use(catchAllErrorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
