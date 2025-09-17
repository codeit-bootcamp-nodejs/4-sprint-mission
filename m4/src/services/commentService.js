import * as commentRepository from '../repositories/commentRepository.js';
import { CustomError } from '../middlewares/errorHandler.js';
import prisma from '../config/prisma.js';

// 댓글 생성 로직 (트랜잭션)
export const createComment = async ({ resourceType, resourceId, content, userId }) => {
    return prisma.$transaction(async (tx) => {
        const data = {
            content,
            userId,
            ...(resourceType === 'post' && { postId: parseInt(resourceId, 10) }),
            ...(resourceType === 'product' && { productId: parseInt(resourceId, 10) }),
        };
        return commentRepository.createComment(data, tx);
    });
};

// 특정 리소스의 댓글 목록 조회
export const findCommentsByResourceId = async (resourceType, resourceId) => {
    return commentRepository.findCommentsByResourceId(resourceType, parseInt(resourceId, 10));
};

// 특정 댓글 상세 조회 로직
export const findCommentById = async (id) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
        throw new CustomError('댓글을 찾을 수 없습니다.', 404);
    }
    return comment;
};

// 댓글 수정 로직 (권한 확인 및 트랜잭션)
export const updateComment = async (commentId, userId, commentData) => {
    return prisma.$transaction(async (tx) => {
        // 1. 댓글 존재 여부 및 권한 확인
        const comment = await commentRepository.findCommentById(commentId, tx);
        if (!comment) {
            throw new CustomError('댓글을 찾을 수 없습니다.', 404);
        }
        if (comment.userId !== userId) {
            throw new CustomError('댓글을 수정할 권한이 없습니다.', 403);
        }

        // 2. 댓글 업데이트
        return commentRepository.updateComment(commentId, commentData, tx);
    });
};

// 댓글 삭제 로직 (권한 확인 및 트랜잭션)
export const deleteComment = async (commentId, userId) => {
    return prisma.$transaction(async (tx) => {
        // 1. 댓글 존재 여부 및 권한 확인
        const comment = await commentRepository.findCommentById(commentId, tx);
        if (!comment) {
            throw new CustomError('댓글을 찾을 수 없습니다.', 404);
        }
        if (comment.userId !== userId) {
            throw new CustomError('댓글을 삭제할 권한이 없습니다.', 403);
        }

        // 2. 댓글 삭제
        await commentRepository.deleteComment(commentId, tx);
        return { message: '댓글이 성공적으로 삭제되었습니다.' };
    });
};
