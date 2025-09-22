// src/repositories/commentRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findCommentById = async (id: number) => {
    return prisma.comment.findUnique({
        where: { id }
    });
};

export const findCommentsByPostId = async (postId: number) => {
    return prisma.comment.findMany({
        where: { postId },
        include: {
            user: { select: { id: true, nickname: true, image: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const findCommentsByProductId = async (productId: number) => {
    return prisma.comment.findMany({
        where: { productId },
        include: {
            user: { select: { id: true, nickname: true, image: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const createComment = async (data: {
    content: string;
    userId: number;
    postId?: number;
    productId?: number;
}) => {
    return prisma.comment.create({
        data,
        include: {
            user: { select: { id: true, nickname: true, image: true } }
        }
    });
};

export const updateComment = async (id: number, content: string) => {
    return prisma.comment.update({
        where: { id },
        data: { content },
        include: {
            user: { select: { id: true, nickname: true, image: true } }
        }
    });
};

export const deleteComment = async (id: number) => {
    return prisma.comment.delete({
        where: { id }
    });
};