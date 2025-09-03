import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import container from './src/container.js';
import productRouter from './src/route/product-router.js';
import articleRouter from './src/route/article-router.js';
import uploadRouter from './src/route/upload-router.js';
import commentRouter from './src/route/comment-router.js';
import { errorHandler } from './middleware/ErrorHandlerMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const { productController, articleController } = container;

app.use('/products', productRouter(productController)); // 미들웨어는 추후 적용 예정
app.use('/articles', articleRouter(articleController)); // 미들웨어는 추후 적용 예정
app.use('/comments', commentRouter);
app.use('/uploads', uploadRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
