import * as likeService from '../services/likeService.js';
import { sendResponse } from '../utils/response.js';

// 좋아요/취소 요청 처리
export const toggleLike = async (req, res, next) => {
    try {
        const { resourceType, resourceId } = req; // 미들웨어에서 설정된 값 사용
        const userId = req.user.id;
        
        const result = await likeService.toggleLike(resourceType, parseInt(resourceId, 10), userId);
        
        sendResponse(res, 200, result.message, { isLiked: result.isLiked });
    } catch (error) {
        next(error);
    }
};

// 내 좋아요 목록 조회 요청 처리 (상품 또는 게시글)
export const getMyLikes = async (req, res, next) => {
    try {
        const { resourceType } = req;
        const userId = req.user.id;
        const likedItems = await likeService.findMyLikes(resourceType, userId);
        sendResponse(res, 200, `내 좋아요 ${ resourceType } 목록 조회 성공`, likedItems);
    } catch (error) {
        next(error);
    }
};
