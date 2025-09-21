import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/service.container.js';
import { AuthRequest } from '../types/auth.js';

interface AuthRequestExtended extends Request, AuthRequest {}

export const authenticateToken = async (req: AuthRequestExtended, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    return;
  }

  try {
    const userService = serviceContainer.getUserService();
    const decoded = userService.verifyAccessToken(token);

    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
    return;
  }
};

export const optionalAuth = async (req: AuthRequestExtended, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const userService = serviceContainer.getUserService();
    const decoded = userService.verifyAccessToken(token);

    const user = await userService.getUserById(decoded.userId);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};