import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies['access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const { userId } = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

export function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies['access-token'];

    if (token) {
      const { userId } = verifyAccessToken(token);
      req.userId = userId;
    }
    next();
  } catch (error) {
    next();
  }
}
