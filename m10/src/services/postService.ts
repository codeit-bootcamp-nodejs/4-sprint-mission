import * as postRepository from '../repositories/postRepository.js';
import * as likeRepository from '../repositories/likeRepository.js';
import { CustomError } from '../middlewares/errorHandler.js';
import prisma from '../config/prisma.js';
import type { CreatePostData, UpdatePostData, PostWithLike } from '../types/post.js';

// 게시글 생성 로직 (트랜잭션)
export const createPost = async (postData: CreatePostData) => {
    return prisma.$transaction(async (tx) => {
        return postRepository.createPost(postData, tx);
    });
};

// 게시글 목록 조회 로직
export const findPosts = async () => {
    return postRepository.findPosts();
};

// 특정 게시글 상세 조회 로직 (좋아요 상태 포함)
export const findPostById = async (id: number, userId?: number | null): Promise<PostWithLike> => {
    const post = await postRepository.findPostById(id);
    if (!post) {
        throw new CustomError('게시글을 찾을 수 없습니다.', 404);
    }

    // 유저가 로그인한 경우에만 좋아요 상태를 확인합니다.
    let isLiked = false;
    if (userId) {
        const liked = await likeRepository.findLike('post', id, userId);
        if (liked) {
            isLiked = true;
        }
    }

    // 응답 객체에 isLiked 필드 추가
    return { ...post, isLiked };
};

// 게시글 수정 로직 (권한 확인 및 트랜잭션)
export const updatePost = async (postId: number, userId: number, postData: UpdatePostData) => {
    return prisma.$transaction(async (tx) => {
        // 1. 게시글 존재 여부 및 권한 확인
        const post = await postRepository.findPostById(postId, tx);
        if (!post) {
            throw new CustomError('게시글을 찾을 수 없습니다.', 404);
        }
        if (post.userId !== userId) {
            throw new CustomError('게시글을 수정할 권한이 없습니다.', 403);
        }

        // 2. 게시글 업데이트
        return postRepository.updatePost(postId, postData, tx);
    });
};

// 게시글 삭제 로직 (권한 확인 및 트랜잭션)
export const deletePost = async (postId: number, userId: number) => {
    return prisma.$transaction(async (tx) => {
        // 1. 게시글 존재 여부 및 권한 확인
        const post = await postRepository.findPostById(postId, tx);
        if (!post) {
            throw new CustomError('게시글을 찾을 수 없습니다.', 404);
        }
        if (post.userId !== userId) {
            throw new CustomError('게시글을 삭제할 권한이 없습니다.', 403);
        }

        // 2. 게시글 삭제
        await postRepository.deletePost(postId, tx);
        return { message: '게시글이 성공적으로 삭제되었습니다.' };
    });
};
