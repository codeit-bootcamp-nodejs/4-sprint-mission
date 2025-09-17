import * as postService from '../services/postService.js';
import { sendResponse } from '../utils/response.js';

// 게시글 등록 요청 처리
export const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;
        const newPost = await postService.createPost({
            title,
            content,
            userId,
        });
        sendResponse(res, 201, '게시글이 성공적으로 등록되었습니다.', newPost);
    } catch (error) {
        next(error);
    }
};

// 전체 게시글 목록 조회 요청 처리
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postService.findPosts();
        sendResponse(res, 200, '게시글 목록 조회 성공', posts);
    } catch (error) {
        next(error);
    }
};

// 특정 게시글 상세 조회 요청 처리 (좋아요 상태 포함)
export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null; // 유저가 로그인되어 있지 않으면 null
        const post = await postService.findPostById(parseInt(id, 10), userId);
        sendResponse(res, 200, '게시글 조회 성공', post);
    } catch (error) {
        next(error);
    }
};

// 게시글 수정 요청 처리
export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, content } = req.body;

        const updatedPost = await postService.updatePost(parseInt(id, 10), userId, { title, content });
        sendResponse(res, 200, '게시글이 성공적으로 수정되었습니다.', updatedPost);
    } catch (error) {
        next(error);
    }
};

// 게시글 삭제 요청 처리
export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await postService.deletePost(parseInt(id, 10), userId);
        sendResponse(res, 200, result.message);
    } catch (error) {
        next(error);
    }
};
