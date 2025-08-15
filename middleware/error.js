export class HttpError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export class BadRequestError extends HttpError {
  constructor(message) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message) {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends HttpError {
  constructor(message) {
    super(409, message);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends HttpError {
  constructor(message) {
    super(500, message);
    this.name = "InternalServerError";
  }
}

export class NotImplementedError extends HttpError {
  constructor(message) {
    super(501, message);
    this.name = "NotImplementedError";
  }
}
