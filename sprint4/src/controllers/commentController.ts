// src/controllers/commentController.ts
import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { CreateComment } from '../types';

/**
 * 특정 게시글 또는 상품의 댓글 목록을 조회합니다.
 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId, productId } = req.query;
        const comments = await commentService.getComments(
            postId ? parseInt(postId as string) : undefined,
            productId ? parseInt(productId as string) : undefined
        );
        res.status(200).json({ comments });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

/**
 * 새로운 댓글을 생성합니다.
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const commentData: CreateComment = req.body;
        const newComment = await commentService.createComment(commentData, userId);
        res.status(201).json({ message: '댓글이 성공적으로 등록되었습니다.', comment: newComment });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

/**
 * 댓글을 수정합니다.
 */
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.id);
        const userId = req.userId!;
        const { content } = req.body;
        const updatedComment = await commentService.updateComment(commentId, content, userId);
        res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.', comment: updatedComment });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('권한이 없습니다')) {
                res.status(403).json({ message: error.message });
            } else if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

/**
 * 댓글을 삭제합니다.
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.id);
        const userId = req.userId!;
        await commentService.deleteComment(commentId, userId);
        res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('권한이 없습니다')) {
                res.status(403).json({ message: error.message });
            } else if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};