import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@lib/appError.js';

export function businessErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // AppError의 인스턴스인지 확인
  if (err instanceof AppError) {
    // console.error(err);
    console.error('===== 비즈니스 로직 에러 발생 =====');
    console.error('에러 이름:', err.name); // 예: BadRequestError
    console.error('에러 코드:', err.statusCode);
    console.error('에러 메시지:', err.message); // 위에서 설정한 구체적인 메시지
    console.error('요청 URL:', req.originalUrl);
    console.error('요청 메서드:', req.method);
    console.error('요청 헤더 (Authorization):', req.headers.authorization); // 토큰 관련 문제 확인
    console.error('요청 쿼리:', req.query); // 쿼리 관련 문제 확인
    console.error('에러 스택:', err.stack); // 에러가 발생한 코드 위치 추적
    console.error('===================');
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? [], // details가 undefined이면 빈 배열
    });
  }

  // AppError가 아니라면, 처리할 수 없는 에러이므로 다음 핸들러로
  return next(err);
}
