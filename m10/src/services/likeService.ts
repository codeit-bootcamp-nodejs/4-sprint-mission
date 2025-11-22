import * as likeRepository from '../repositories/likeRepository.js';
import { CustomError } from '../middlewares/errorHandler.js';
import prisma from '../config/prisma.js';

interface ToggleLikeResult {
    message: string;
    isLiked: boolean;
}

export const toggleLike = async (
    resourceType: string,
    resourceId: number,
    userId: number,
): Promise<ToggleLikeResult> => {
    return prisma.$transaction(async (tx) => {
        const like = await likeRepository.findLike(resourceType, resourceId, userId, tx);

        let isLiked = false;
        let message = '';

        // 좋아요를 누르려는 대상(상품 또는 게시글)이 존재하는지 확인
        if (resourceType === 'product') {
            const productExists = await tx.product.findUnique({ where: { id: resourceId } });
            if (!productExists) {
                throw new CustomError('해당 상품을 찾을 수 없습니다.', 404);
            }
        } else if (resourceType === 'post') {
            const postExists = await tx.post.findUnique({ where: { id: resourceId } });
            if (!postExists) {
                throw new CustomError('해당 게시글을 찾을 수 없습니다.', 404);
            }
        }

        if (like) {
            // 이미 좋아요를 누른 경우, 좋아요 삭제
            await likeRepository.deleteLike(like.id, tx);
            message = '좋아요 취소 성공';
            isLiked = false;
        } else {
            // 좋아요를 누르지 않은 경우, 좋아요 생성
            await likeRepository.createLike(resourceType, resourceId, userId, tx);
            message = '좋아요 성공';
            isLiked = true;
        }

        return { message, isLiked };
    });
};

export const findMyLikes = async (resourceType: string, userId: number) => {
    return likeRepository.findMyLikes(resourceType, userId);
};

// 유저의 모든 좋아요 목록 조회 로직
export const findAllLikes = async (userId: number) => {
    return likeRepository.findAllLikesByUserId(userId);
};

