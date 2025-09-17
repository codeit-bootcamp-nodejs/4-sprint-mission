import prisma from '../config/prisma.js';

// 새 댓글 생성
export const createComment = async (data, tx = prisma) => {
    return tx.comment.create({ data });
};

// 특정 리소스의 댓글 목록 조회
export const findCommentsByResourceId = async (resourceType, resourceId, tx = prisma) => {
    const whereCondition = resourceType === 'post' ? { postId: resourceId } : { productId: resourceId };

    return tx.comment.findMany({
        where: whereCondition,
    });
};

// 특정 댓글 ID로 조회
export const findCommentById = async (id, tx = prisma) => {
    return tx.comment.findUnique({
        where: { id },
    });
};

// 댓글 업데이트
export const updateComment = async (id, data, tx = prisma) => {
    return tx.comment.update({
        where: { id },
        data,
    });
};

// 특정 댓글 삭제
export const deleteComment = async (id, tx = prisma) => {
    return tx.comment.delete({
        where: { id },
    });
};
