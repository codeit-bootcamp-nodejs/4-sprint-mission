import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }

  res.status(500).json({ error: err.message || 'Internal server error' });
};
