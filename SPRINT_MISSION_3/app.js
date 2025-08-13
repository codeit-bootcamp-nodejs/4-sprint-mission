import express from 'express';
import dotenv from 'dotenv';

import productRoutes from './routes/products.routes.js';
import articleRoutes from './routes/Article.routes.js';
import commentRouter from './routes/comment.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import uploadRouter from './routes/upload.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// 라우터 등록
app.use('/products', productRoutes);
app.use('/article', articleRoutes);
app.use('/api', commentRouter);
app.use(errorHandler);
app.use('/upload', uploadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});