import type { RequestHandler } from 'express';

export default function asyncHandler(func: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
