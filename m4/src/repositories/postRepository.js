import prisma from '../config/prisma.js';

// 게시글 생성
export const createPost = async (data, tx = prisma) => {
    return tx.post.create({ data });
};

// 모든 게시글 조회
export const findPosts = async (tx = prisma) => {
    return tx.post.findMany();
};

// 특정 게시글 ID로 조회
export const findPostById = async (id, tx = prisma) => {
    return tx.post.findUnique({
        where: { id },
    });
};

// 게시글 업데이트
export const updatePost = async (id, data, tx = prisma) => {
    return tx.post.update({
        where: { id },
        data,
    });
};

// 특정 게시글 삭제
export const deletePost = async (id, tx = prisma) => {
    return tx.post.delete({
        where: { id },
    });
};
