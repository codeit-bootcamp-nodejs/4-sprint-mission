import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authOptionalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const [tokenType, tokenValue] = authorization.split(' ');
      if (tokenType === 'Bearer') {
        const decoded = jwt.verify(
          tokenValue,
          process.env.JWT_SECRET!,
        ) as jwt.JwtPayload;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (user) {
          delete (user as any).password;
          (req as any).user = user;
        }
      }
    }
  } catch (error: any) {
    console.error('Optional Auth Error:', error.message);
  }
  next();
};