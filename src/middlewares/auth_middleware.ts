// src/middlewares/auth_middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
        }

        const token = authHeader.substring(7);

        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };

        req.user = decoded;
        next();
    } catch (error) {
        console.error('인증 실패:', error);
        return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
};