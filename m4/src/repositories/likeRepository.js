import prisma from '../config/prisma.js';

// 특정 좋아요를 조회합니다.
export const findLike = async (resourceType, resourceId, userId, tx = prisma) => {
    const whereCondition =
        resourceType === 'post'
            ? { userId_postId: { userId, postId: resourceId } }
            : { userId_productId: { userId, productId: resourceId } };

    return tx.like.findUnique({
        where: whereCondition,
    });
};

// 좋아요를 생성합니다.
export const createLike = async (resourceType, resourceId, userId, tx = prisma) => {
    const data = resourceType === 'post' ? { userId, postId: resourceId } : { userId, productId: resourceId };

    return tx.like.create({ data });
};

// 특정 좋아요를 삭제합니다.
export const deleteLike = async (likeId, tx = prisma) => {
    return tx.like.delete({
        where: { id: likeId },
    });
};

// 유저가 좋아요를 누른 목록을 조회합니다.
export const findMyLikes = async (resourceType, userId) => {
    const include = resourceType === 'product' ? { product: true } : { post: true };

    const where = resourceType === 'product' ? { userId, productId: { not: null } } : { userId, postId: { not: null } };

    return prisma.like.findMany({
        where,
        include,
    });
};
