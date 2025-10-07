// errorHandler.ts
import multer from 'multer';
import type { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error((err as Error)?.stack ?? err);

  // 기본값
  let statusCode = (err && (err as any).statusCode) ?? 500;
  let message = (err && (err as any).message) ?? '서버 오류';

  // Prisma 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint 위반
        const fields = (err.meta?.target as string[]) || [];
        if (fields.includes('username')) {
          message = '이미 사용 중인 닉네임입니다.';
        } else if (fields.includes('email')) {
          message = '이미 사용 중인 이메일입니다.';
        } else {
          message = `중복된 값이 존재합니다. (${fields.join(', ')})`;
        }
        statusCode = 409;
        break;
      }
      case 'P2003': {
        // Foreign key constraint 위반
        message = '잘못된 참조로 인해 작업이 불가능합니다.';
        statusCode = 400;
        break;
      }
      default: {
        message = `DB 요청 에러 (${err.code})`;
        statusCode = 400;
      }
    }
  }

  // Multer 에러 처리
  else if (err instanceof multer.MulterError) {
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
        message = (err as Error).message ?? message;
    }
  }

  // 응답 (개발 / 운영 분리)
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ message });
  } else {
    return res.status(statusCode).json({
      message,
      stack: err.stack,
    });
  }
};

export default errorHandler;
