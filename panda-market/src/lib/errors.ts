import type { ErrorDetail } from '@/types/error.types.js';
import { AppError } from './appError.js';

export class UnauthorizedError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = '데이터가 이미 존재합니다.') {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message = '잘못된 요청입니다.', details?: ErrorDetail[]) {
    super(message, 400, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, 403);
  }
}

export class InternalServerError extends AppError {
  constructor(message = '서버에 문제가 발생했습니다.') {
    super(message, 500);
  }
}
