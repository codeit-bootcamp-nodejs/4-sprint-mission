import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreatePostData, UpdatePostData } from '../types/post.js';

type PrismaTransaction = Prisma.TransactionClient;

// 게시글 생성
export const createPost = async (data: CreatePostData, tx: PrismaTransaction = prisma) => {
    return tx.post.create({ data });
};

// 모든 게시글 조회
export const findPosts = async (tx: PrismaTransaction = prisma) => {
    return tx.post.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
        },
    });
};

// 특정 게시글 ID로 조회
export const findPostById = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.post.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
        },
    });
};

// 게시글 업데이트
export const updatePost = async (id: number, data: UpdatePostData, tx: PrismaTransaction = prisma) => {
    return tx.post.update({
        where: { id },
        data,
    });
};

// 특정 게시글 삭제
export const deletePost = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.post.delete({
        where: { id },
    });
};
