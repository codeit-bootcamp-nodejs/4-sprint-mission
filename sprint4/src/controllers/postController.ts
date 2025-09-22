// src/controllers/postController.ts
import { Request, Response } from 'express';
import * as postService from '../services/postService';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json({ posts });
    } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { post, isLiked } = await postService.getPostWithLikeStatus(parseInt(id), userId);
        res.status(200).json({ post, isLiked });
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        if (error instanceof Error) {
            if (error.message === '게시글을 찾을 수 없습니다.') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;
        const userId = req.userId!;
        const post = await postService.createPost(title, content, userId);
        res.status(201).json({ message: '게시글이 성공적으로 등록되었습니다.', post });
    } catch (error) {
        console.error('게시글 생성 오류:', error);
        if (error instanceof Error) {
            if (error.message === '제목과 내용은 필수 입력사항입니다.') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId!;
        const { title, content } = req.body;
        const post = await postService.updatePost(parseInt(id), userId, { title, content });
        res.status(200).json({ message: '게시글이 성공적으로 수정되었습니다.', post });
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        if (error instanceof Error) {
            if (error.message === '게시글을 찾을 수 없습니다.') {
                res.status(404).json({ message: error.message });
            } else if (error.message === '게시글을 수정할 권한이 없습니다.') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId!;
        await postService.deletePost(parseInt(id), userId);
        res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        if (error instanceof Error) {
            if (error.message === '게시글을 찾을 수 없습니다.') {
                res.status(404).json({ message: error.message });
            } else if (error.message === '게시글을 삭제할 권한이 없습니다.') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId!;
        await postService.likePost(parseInt(id), userId);
        res.status(201).json({ message: '게시글에 좋아요를 눌렀습니다.' });
    } catch (error) {
        console.error('게시글 좋아요 오류:', error);
        if (error instanceof Error) {
            if (error.message === '게시글을 찾을 수 없습니다.') {
                res.status(404).json({ message: error.message });
            } else if (error.message === '이미 좋아요를 누른 게시글입니다.') {
                res.status(409).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

export const unlikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId!;
        await postService.unlikePost(parseInt(id), userId);
        res.status(200).json({ message: '게시글 좋아요가 취소되었습니다.' });
    } catch (error) {
        console.error('게시글 좋아요 취소 오류:', error);
        if (error instanceof Error) {
            if (error.message === '좋아요를 누르지 않은 게시글입니다.') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};