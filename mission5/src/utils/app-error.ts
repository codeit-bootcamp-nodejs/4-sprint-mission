export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '로그인이 필요합니다.') {
    super(message, 401);
  }
}

export class BadRequestError extends AppError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}