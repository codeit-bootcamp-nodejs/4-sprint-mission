import express from 'express';
import multer from 'multer';
import productRouter from './routes/product.router.js';
import articleRouter from './routes/article.router.js';
import imageRouter from './image.js';
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

// 404
app.use((req, res) => {
  res.status(404).json({ message: '해당 경로를 찾을 수 없습니다.' });
});

// 500
app.use((err, req, res) => {
  console.error(err.stack);
  let statusCode = err.status || 500;
  let message = err.message || '서버 오류';

  // 멀터 처리
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = '파일 크기가 너무 큽니다. (최대 5MB)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = '허용되지 않는 파일 필드입니다.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = '최대 5개의 파일만 업로드할 수 있습니다.';
      default:
        message = err.message;
        break;
    }
  }
  res.status(statusCode).json({ message: message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
