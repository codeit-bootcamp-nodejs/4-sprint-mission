import prisma from '../config/prisma.js';

async function save(user) {
    return prisma.user.create({
        data: {
            email: user.email,
            nickname: user.nickname,
            password: user.password,
        },
    });
}

async function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

async function update(id, data) {
    return prisma.user.update({
        where: {
            id,
        },
        data,
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}

async function updateUserPassword(id, password) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            password,
        }
    })
}

export default {
    save,
    findByEmail,
    update,
    findById,
    updateUserPassword,
}