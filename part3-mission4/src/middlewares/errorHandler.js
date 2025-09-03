import multer from 'multer';
import express from 'express';

const router = express.Router();
const app = express();

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: '데이터를 찾을 수 없습니다.' });
});

// 500
app.use((err, req, res, next) => {
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

export default router;
