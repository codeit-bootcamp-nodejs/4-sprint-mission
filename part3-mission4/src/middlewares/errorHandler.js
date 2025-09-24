// errorHandler.js
import multer from 'multer';
import AppError from '../lib/appError.js';

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // 기본값
  let statusCode = err.statusCode || 500;
  let message = err.message || '서버 오류';

  // 멀터 에러 처리
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
        break;
      default:
        message = err.message;
    }
  }

  // 운영/개발 모드 분리 가능
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ message });
  } else {
    return res.status(statusCode).json({
      message,
      stack: err.stack,
    });
  }
}

export default errorHandler;
