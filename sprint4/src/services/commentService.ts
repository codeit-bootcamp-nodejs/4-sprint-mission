import * as commentRepository from '../repositories/commentRepository';
import * as postRepository from '../repositories/postRepository';
import * as productRepository from '../repositories/productRepository';
import type { CreateComment } from '../types';

/**
 * 특정 게시글 또는 상품의 댓글 목록을 조회합니다.
 * @param postId - (선택 사항) 게시글 ID
 * @param productId - (선택 사항) 상품 ID
 * @returns 댓글 목록
 */
export const getComments = async (postId?: number, productId?: number) => {
    if (!postId && !productId) {
        const error = new Error('게시글 또는 상품 ID가 필요합니다.');
        error.name = 'ValidationError';
        throw error;
    }

    if (postId && productId) {
        const error = new Error('게시글 또는 상품 ID 중 하나만 지정해야 합니다.');
        error.name = 'ValidationError';
        throw error;
    }

    if (postId) {
        return commentRepository.findCommentsByPostId(postId);
    }

    // productId가 있을 경우를 대비해 productId 타입이 number인지 확인합니다.
    if (productId) {
        return commentRepository.findCommentsByProductId(productId);
    }

    return [];
};

/**
 * 새로운 댓글을 생성합니다.
 * @param data - 댓글 생성 데이터 (내용, 게시글/상품 ID)
 * @param userId - 댓글 작성자 ID
 * @returns 생성된 댓글 정보
 */
export const createComment = async (data: CreateComment, userId: number) => {
    const { content, postId, productId } = data;

    if (!content) {
        const error = new Error('댓글 내용은 필수 입력사항입니다.');
        error.name = 'ValidationError';
        throw error;
    }

    if (!postId && !productId) {
        const error = new Error('게시글 또는 상품 ID가 필요합니다.');
        error.name = 'ValidationError';
        throw error;
    }

    if (postId && productId) {
        const error = new Error('게시글 또는 상품 ID 중 하나만 지정해야 합니다.');
        error.name = 'ValidationError';
        throw error;
    }

    // Service가 다른 Repository를 직접 호출하여 부모 리소스(게시글/상품)의 존재 여부를 확인합니다.
    if (postId) {
        const post = await postRepository.findPostById(postId);
        if (!post) {
            const error = new Error('해당 게시글을 찾을 수 없습니다.');
            error.name = 'NotFoundError';
            throw error;
        }
    }

    if (productId) {
        const product = await productRepository.findProductById(productId);
        if (!product) {
            const error = new Error('해당 상품을 찾을 수 없습니다.');
            error.name = 'NotFoundError';
            throw error;
        }
    }

    return commentRepository.createComment({ content, userId, postId, productId });
};

/**
 * 댓글을 수정합니다.
 * @param id - 수정할 댓글 ID
 * @param content - 새로운 댓글 내용
 * @param userId - 요청한 사용자 ID
 * @returns 수정된 댓글 정보
 */
export const updateComment = async (id: number, content: string, userId: number) => {
    if (!content) {
        const error = new Error('댓글 내용은 필수 입력사항입니다.');
        error.name = 'ValidationError';
        throw error;
    }

    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.name = 'NotFoundError';
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('댓글을 수정할 권한이 없습니다.');
        error.name = 'ForbiddenError';
        throw error;
    }

    return commentRepository.updateComment(id, content);
};

/**
 * 댓글을 삭제합니다.
 * @param id - 삭제할 댓글 ID
 * @param userId - 요청한 사용자 ID
 */
export const deleteComment = async (id: number, userId: number) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.name = 'NotFoundError';
        throw error;
    }

    if (comment.userId !== userId) {
        const error = new Error('댓글을 삭제할 권한이 없습니다.');
        error.name = 'ForbiddenError';
        throw error;
    }

    return commentRepository.deleteComment(id);
};