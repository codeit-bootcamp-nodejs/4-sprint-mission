import prisma from '../config/prisma.js';

async function findById(id) {
    return prisma.comment.findUnique({
        where: {
            id,
        }
    })
}

//상품에 댓글 등록 
async function saveCommentForProduct(commentData, productId, userId) {
    return prisma.comment.create({
        data: {
            content: commentData.content,
            productComment: {
                connect: { id: productId },
            },
            owner: {
                connect: { id: userId },
            },
        },
    });
}

//게시글에 댓글 등록
async function saveCommentForPost(commentData, postId, userId) {
    return prisma.comment.create({
        data: {
            content: commentData.content,
            postComment: {
                connect: { id: postId },
            },
            owner: {
                connect: { id: userId },
            },
        },
    });
}


async function update(data, id) {
    return prisma.comment.update({
        where: {
            id,
        },
        data,
    })
}

async function deletedCommentById(id) {
    return prisma.comment.delete({
        where: {
            id,
        }
    })
}

export default {
    findById,
    saveCommentForPost,
    saveCommentForProduct,
    update,
    deletedCommentById,
}