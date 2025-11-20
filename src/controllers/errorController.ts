import { Request, Response, NextFunction } from 'express';

export function defaultNotFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: 'Not found' });
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
}
