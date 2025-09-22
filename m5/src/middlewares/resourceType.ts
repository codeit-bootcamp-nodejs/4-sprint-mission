import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response.js';

export const setResourceType = (type: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req 객체에 리소스 타입과 ID를 할당합니다.
        req.resourceType = type;
        if (req.params['id']) {
            req.resourceId = req.params['id'];
        } else {
            // ID가 필요하지 않은 경우(예: 목록 조회), 다음으로 넘어갑니다.
            req.resourceId = null;
        }

        // 유효하지 않은 타입에 대한 검증을 추가할 수 있습니다.
        const RESOURCE_TYPES = ['product', 'post', 'user', 'comment', 'like'];
        if (!RESOURCE_TYPES.includes(type)) {
            return sendResponse(res, 400, `유효하지 않은 리소스 타입입니다: ${type}`);
        }
        next();
    };
};
