import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response.js';

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return sendResponse(res, 400, '이미지 파일이 필요합니다.');
        }

        // 서버 주소 기반 URL 생성
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        sendResponse(res, 201, '이미지 업로드 성공', { imageUrl });
    } catch (error) {
        next(error);
    }
};
