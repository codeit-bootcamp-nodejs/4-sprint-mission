import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response.js';
import { IS_PRODUCTION, AWS_S3_BASE_URL } from '../config/constants.js';

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return sendResponse(res, 400, '이미지 파일이 필요합니다.');
        }

        // 환경에 따라 URL 생성
        let imageUrl: string;

        if (IS_PRODUCTION) {
            // 프로덕션: S3 URL 사용
            // multer-s3는 자동으로 location 필드에 S3 URL을 넣어줌
            imageUrl = (req.file as any).location || `${AWS_S3_BASE_URL}/${(req.file as any).key}`;
        } else {
            // 개발: 로컬 서버 URL 사용
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        sendResponse(res, 201, '이미지 업로드 성공', { imageUrl });
    } catch (error) {
        next(error);
    }
};
