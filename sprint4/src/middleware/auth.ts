// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: '인증 토큰이 필요합니다.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('인증 오류:', error);
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

export default authMiddleware;