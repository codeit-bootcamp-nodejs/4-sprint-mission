import prisma from '../config/prisma.js';

export const findUserByEmail = async (email, tx = prisma) => {
    return tx.user.findUnique({
        where: {
            email,
        },
    });
};

export const findUserById = async (id, tx = prisma) => {
    return tx.user.findUnique({
        where: {
            id,
        },
    });
};

export const updateUser = async (id, data, tx = prisma) => {
    return tx.user.update({
        where: {
            id,
        },
        data,
    });
};

export const updateUserPassword = async (id, password, tx = prisma) => {
    return tx.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
    });
};
