import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { NotFoundError, ConflictError, BadRequestError } from '@/lib/errors.js';

export function prismaErrorHandler(
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error(err);
    return next(new BadRequestError('Prisma 쿼리 데이터가 유효하지 않습니다.'));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(err);
    switch (err.code) {
      case 'P2025':
        return next(new NotFoundError('요청한 데이터를 찾을 수 없습니다.'));
      case 'P2002':
        const field = (err.meta?.['target'] as string[])?.[0];
        const modelName = err.meta?.['modelName'] as string;
        let msg = '';
        if (modelName.endsWith('Like')) {
          msg = '이미 좋아요를 눌렀습니다.';
        } else {
          msg = `${field} 필드의 값이 이미 존재합니다.`;
        }
        return next(new ConflictError(msg));
      case 'P2003':
        return next(new BadRequestError('연결된 데이터를 찾을 수 없습니다.'));
      default:
        // 처리하지 않을 Prisma 에러는 그냥 넘김
        break;
    }
  }
  // Prisma 에러가 아니면 다음 핸들러로 넘김
  next(err);
}
