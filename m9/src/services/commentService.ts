import * as commentRepository from '../repositories/commentRepository.js';
import * as notificationService from './notificationService.js';
import { CustomError } from '../middlewares/errorHandler.js';
import prisma from '../config/prisma.js';
import type { CreateCommentServiceData, UpdateCommentData } from '../types/comment.js';

// 댓글 생성 로직 (트랜잭션)
export const createComment = async ({ resourceType, resourceId, content, userId }: CreateCommentServiceData) => {
    let postOwnerId: number | null = null;
    let productOwnerId: number | null = null;

    // 1. 댓글 생성 트랜잭션
    const comment = await prisma.$transaction(async (tx) => {
        // resourceType에 따라 Post 또는 Product 존재 여부 확인
        if (resourceType === 'post') {
            const post = await tx.post.findUnique({
                where: { id: parseInt(resourceId.toString(), 10) },
                select: { userId: true, title: true }
            });
            if (!post) {
                throw new CustomError('해당 게시글을 찾을 수 없습니다.', 404);
            }
            postOwnerId = post.userId;
        } else if (resourceType === 'product') {
            const product = await tx.product.findUnique({
                where: { id: parseInt(resourceId.toString(), 10) },
                select: { userId: true, name: true }
            });
            if (!product) {
                throw new CustomError('해당 상품을 찾을 수 없습니다.', 404);
            }
            productOwnerId = product.userId;
        } else {
            throw new CustomError('유효하지 않은 리소스 타입입니다.', 400);
        }

        const data = {
            content,
            userId,
            ...(resourceType === 'post' && { postId: parseInt(resourceId.toString(), 10) }),
            ...(resourceType === 'product' && { productId: parseInt(resourceId.toString(), 10) }),
        };
        return commentRepository.createComment(data, tx);
    });

    // 2. 알림 전송 (별도 트랜잭션)
    // 게시글 알림
    if (resourceType === 'post' && postOwnerId && postOwnerId !== userId) {
        await notificationService.createAndSendNotification({
            type: 'NEW_COMMENT',
            message: `내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.`,
            userId: postOwnerId,
            postId: parseInt(resourceId.toString(), 10),
            commentId: comment.id,
        });
    }

    // 상품 알림
    if (resourceType === 'product' && productOwnerId && productOwnerId !== userId) {
        await notificationService.createAndSendNotification({
            type: 'NEW_COMMENT',
            message: `내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.`,
            userId: productOwnerId,
            productId: parseInt(resourceId.toString(), 10),
            commentId: comment.id,
        });
    }

    return comment;
};

// 특정 리소스의 댓글 목록 조회
export const findCommentsByResourceId = async (resourceType: string, resourceId: number) => {
    return commentRepository.findCommentsByResourceId(resourceType, parseInt(resourceId.toString(), 10));
};

// 특정 댓글 상세 조회 로직
export const findCommentById = async (id: number) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
        throw new CustomError('댓글을 찾을 수 없습니다.', 404);
    }
    return comment;
};

// 댓글 수정 로직 (권한 확인 및 트랜잭션)
export const updateComment = async (commentId: number, userId: number, commentData: UpdateCommentData) => {
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
export const deleteComment = async (commentId: number, userId: number) => {
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
