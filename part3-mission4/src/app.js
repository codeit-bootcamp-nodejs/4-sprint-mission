import express from 'express';
import productRouter from './routes/product-router.js';
import articleRouter from './routes/article-router.js';
import imageRouter from './image.js';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3001',
      'https://codeit-mission3.com',
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/images', imageRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
