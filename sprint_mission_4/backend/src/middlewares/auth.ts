import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  console.log('authenticateToken called for:', req.method, req.url);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token ? 'present' : 'missing');

  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    console.log('Token decoded successfully, userId:', decoded.userId);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, nickname: true }
    });

    if (!user) {
      console.log('User not found for userId:', decoded.userId);
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    console.log('User authenticated:', user);
    req.user = user;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
    return;
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, nickname: true }
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};