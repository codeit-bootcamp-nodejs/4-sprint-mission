import postRepository from '../repositories/postRepository.js';

async function createPost(postData, userId) {
    return await postRepository.save(postData, userId);
}

async function updatePost(userId, postData, postId) {
    const post = await postRepository.findPostById(postId);
    if (!post) {
        const error = new Error('not found');
        error.code = 404;
        throw error;
    }
    if (post.postedId !== userId) {
        const error = new Error('Permission denied');
        error.code = 403;
        throw error;
    }
    return await postRepository.update(postId, postData);
}

async function deletePost(postId, userId) {
    const post = await postRepository.findPostById(postId);

    if (!post) {
        const error = new Error('not found');
        error.code = 404;
        throw error;
    }

    if (post.postedId !== userId) {
        const error = new Error('Permission denied');
        error.code = 403;
        throw error;
    }

    return await postRepository.deletePost(postId);
}



export default {
    createPost,
    updatePost,
    deletePost,
}