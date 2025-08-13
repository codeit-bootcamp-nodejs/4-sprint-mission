// src/app.js
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product_routes.js';
import articleRoutes from './routes/article_routes.js';
import commentRoutes from './routes/comment_routes.js';
import uploadRoutes from './routes/upload_routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// 기본 미들웨어
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// 라우터 연결
app.use('/products', productRoutes);
app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);
app.use('/upload', uploadRoutes);

// 에러 핸들러
app.use(errorHandler);

export default app;
