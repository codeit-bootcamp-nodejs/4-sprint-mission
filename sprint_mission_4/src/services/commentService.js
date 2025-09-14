import commentRepository from "../repositories/commentRepository.js";
import productRepository from '../repositories/productRepository.js';
import postRepository from '../repositories/postRepository.js';


// 로그인한 유저만 상품에 댓글 등록 가능
// 댓글은 특정 상품에 속해 있다는 관계만 표현하믄 된다.

async function createCommentByProduct(commentData, productId, userId) {
    const product = await productRepository.findProductById(productId);
    if (!product) {
        const error = new Error('Product not found');
        error.code = 404;
        throw error;
    }
    return await commentRepository.saveCommentForProduct(commentData, productId, userId);
}


// 로그인한 유저만 게시글에 댓글을 등록 가능

async function createCommentByPost(commentByPostData, postId, userId) {
    const post = await postRepository.findPostById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    return await commentRepository.saveCommentForPost(commentByPostData, postId, userId);
}

// 댓글을 등록한 유저만 해당 댓글을 수정 or 삭제 가능

async function updateComment(commentData, commentId, userId) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
        const error = new Error('Comment not found');
        error.code = 404;
        throw error;
    }
    if (comment.ownerId !== userId) {
        const error = new Error('Authorization denied');
        error.code = 403;
        throw error;
    }

    return await commentRepository.update(commentData, commentId);
}

// 삭제
async function deleteComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
        const error = new Error('Comment not found');
        error.code = 404;
        throw error;
    }
    if (comment.ownerId !== userId) {
        const error = new Error('Authorization denied');
        error.code = 403;
        throw error;
    }

    return await commentRepository.deletedCommentById(commentId);
}

export default {
    createCommentByProduct,
    createCommentByPost,
    updateComment,
    deleteComment,
}