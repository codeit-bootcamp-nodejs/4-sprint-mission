import * as commentService from '../services/commentService.js';
import { sendResponse } from '../utils/response.js';

// 특정 리소스에 대한 댓글 등록 요청 처리
export const createComment = async (req, res, next) => {
    try {
        // 라우터에서 전달된 resourceType과 resourceId를 사용
        const { resourceType, resourceId } = req;
        const { content } = req.body;
        const userId = req.user.id;

        const newComment = await commentService.createComment({
            resourceType,
            resourceId,
            content,
            userId,
        });
        sendResponse(res, 201, '댓글이 성공적으로 등록되었습니다.', newComment);
    } catch (error) {
        next(error);
    }
};

// 특정 리소스의 전체 댓글 목록 조회 요청 처리
export const getCommentsByResourceId = async (req, res, next) => {
    try {
        const { resourceType, resourceId } = req;
        const comments = await commentService.findCommentsByResourceId(resourceType, resourceId);
        sendResponse(res, 200, '댓글 목록 조회 성공', comments);
    } catch (error) {
        next(error);
    }
};

// 특정 댓글 상세 조회 요청 처리
export const getCommentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await commentService.findCommentById(parseInt(id, 10));
        sendResponse(res, 200, '댓글 조회 성공', comment);
    } catch (error) {
        next(error);
    }
};

// 댓글 수정 요청 처리
export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        const updatedComment = await commentService.updateComment(parseInt(id, 10), userId, { content });
        sendResponse(res, 200, '댓글이 성공적으로 수정되었습니다.', updatedComment);
    } catch (error) {
        next(error);
    }
};

// 댓글 삭제 요청 처리
export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await commentService.deleteComment(parseInt(id, 10), userId);
        sendResponse(res, 200, result.message);
    } catch (error) {
        next(error);
    }
};
