import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';

type PrismaTransaction = Prisma.TransactionClient;

export const findLike = async (
    resourceType: string,
    resourceId: number,
    userId: number,
    tx: PrismaTransaction = prisma,
) => {
    const whereCondition =
        resourceType === 'post'
            ? { userId_postId: { userId, postId: resourceId } }
            : { userId_productId: { userId, productId: resourceId } };

    return tx.like.findUnique({
        where: whereCondition,
    });
};

export const createLike = async (
    resourceType: string,
    resourceId: number,
    userId: number,
    tx: PrismaTransaction = prisma,
) => {
    const data = resourceType === 'post' ? { userId, postId: resourceId } : { userId, productId: resourceId };

    return tx.like.create({ data });
};

export const deleteLike = async (likeId: number, tx: PrismaTransaction = prisma) => {
    return tx.like.delete({
        where: { id: likeId },
    });
};

export const findMyLikes = async (resourceType: string, userId: number) => {
    const include = resourceType === 'product' ? { product: true } : { post: true };

    const where = resourceType === 'product' ? { userId, productId: { not: null } } : { userId, postId: { not: null } };

    return prisma.like.findMany({
        where,
        include,
    });
};

export const findAllLikesByUserId = async (userId: number, tx: PrismaTransaction = prisma) => {
    return tx.like.findMany({
        where: { userId },
        include: {
            post: true,
            product: true,
        },
    });
};
