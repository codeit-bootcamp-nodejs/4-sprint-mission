import { Request, Response, NextFunction, RequestHandler } from 'express';

export function withAsync(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
