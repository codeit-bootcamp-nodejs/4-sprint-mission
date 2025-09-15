import prisma from '../config/prisma.js';

async function save(postData, userId) {
    return prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            posted: {
                connect: {
                    userId,
                }
            }
        }
    })
}

async function update(id, data) {
    return prisma.post.update({
        where: {
            id,
        },
        data,
    })
}

async function findPostById(id) {
    return prisma.post.findUnique({
        where: {
            id,
        }
    })
}

async function deletePost(id) {
    return prisma.post.delete({
        where: {
            id,
        }
    })
}

export default {
    save,
    update,
    findPostById,
    deletePost,
}