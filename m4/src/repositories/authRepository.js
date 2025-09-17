import prisma from '../config/prisma.js';

/** 유저 생성 */
export const createUser = async (userData, tx = prisma) => {
    return tx.user.create({
        data: userData,
    });
};

/** ID로 유저 조회 */
export const findUserById = async (id, tx = prisma) => {
    return tx.user.findUnique({
        where: { id },
    });
};

/** 이메일로 유저 조회 */
export const findUserByEmail = async (email, tx = prisma) => {
    return tx.user.findUnique({
        where: { email },
    });
};
