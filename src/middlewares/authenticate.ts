import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nickname: string;
      };
    }
  }
}

export default function authenticate(required: boolean = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        if (required) {
          throw new UnauthorizedError('Authentication required');
        }
        return next();
      }

      const user = await authService.authenticate(accessToken);
      req.user = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      };
      next();
    } catch (error) {
      if (required) {
        next(error);
      } else {
        next();
      }
    }
  };
}
