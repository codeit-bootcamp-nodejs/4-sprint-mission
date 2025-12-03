import type { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService.js';
import { sendResponse } from '../utils/response.js';
import { CustomError } from '../middlewares/errorHandler.js';

// 특정 리소스에 대한 댓글 등록 요청 처리
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const { resourceType, resourceId } = req;
        const { content } = req.body;

        if (!resourceType || !resourceId || !content) {
            return sendResponse(res, 400, '리소스 타입, 리소스 ID, 내용은 필수 입력값입니다.');
        }

        const userId = req.user.id;

        const newComment = await commentService.createComment({
            resourceType,
            resourceId: parseInt(resourceId, 10),
            content,
            userId,
        });
        sendResponse(res, 201, '댓글이 성공적으로 등록되었습니다.', newComment);
    } catch (error) {
        next(error);
    }
};

// 특정 리소스의 전체 댓글 목록 조회 요청 처리
export const getCommentsByResourceId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { resourceType, resourceId } = req;
        const comments = await commentService.findCommentsByResourceId(resourceType!, parseInt(resourceId!, 10));
        sendResponse(res, 200, '댓글 목록 조회 성공', comments);
    } catch (error) {
        next(error);
    }
};

// 특정 댓글 상세 조회 요청 처리
export const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const comment = await commentService.findCommentById(parseInt(id, 10));
        sendResponse(res, 200, '댓글 조회 성공', comment);
    } catch (error) {
        next(error);
    }
};

// 댓글 수정 요청 처리
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const { id } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) {
            return sendResponse(res, 400, '내용은 필수 입력값입니다.');
        }

        const updatedComment = await commentService.updateComment(parseInt(id, 10), userId, { content });
        sendResponse(res, 200, '댓글이 성공적으로 수정되었습니다.', updatedComment);
    } catch (error) {
        next(error);
    }
};

// 댓글 삭제 요청 처리
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new CustomError('인증되지 않은 사용자입니다.', 401);
        }
        const { id } = req.params;
        const userId = req.user.id;

        const result = await commentService.deleteComment(parseInt(id, 10), userId);
        sendResponse(res, 200, result.message);
    } catch (error) {
        next(error);
    }
};
