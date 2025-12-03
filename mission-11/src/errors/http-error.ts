// src/errors/http-errors.ts

export class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = '요청한 데이터 형식이 올바르지 않습니다.') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = '인증 정보가 유효하지 않습니다.') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = '접근 권한이 없습니다.') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = '데이터가 충돌되었습니다.') {
    super(409, message);
  }
}

export class ServerError extends HttpError {
    constructor(message = '서버 내부 오류가 발생했습니다.') {
        super(500, message);
    }
}
