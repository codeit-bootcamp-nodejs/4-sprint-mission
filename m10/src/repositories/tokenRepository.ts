import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';

type PrismaTransaction = Prisma.TransactionClient;

/** 특정 토큰 조회 */
export const findRefreshToken = async (token: string, tx: PrismaTransaction = prisma) => {
    return tx.refreshToken.findUnique({
        where: { token },
    });
};

/** 특정 토큰 삭제 */
export const deleteRefreshToken = async (token: string, tx: PrismaTransaction = prisma) => {
    return tx.refreshToken.deleteMany({
        where: { token },
    });
};

/** 사용자 ID로 모든 토큰 삭제 */
export const deleteTokensByUserId = async (userId: number, tx: PrismaTransaction = prisma) => {
    return tx.refreshToken.deleteMany({
        where: { userId },
    });
};

/** 리프레시 토큰 생성 */
export const createRefreshToken = async (
    token: string,
    userId: number,
    expiredAt: Date,
    tx: PrismaTransaction = prisma,
) => {
    return tx.refreshToken.create({
        data: { token, userId, expiredAt },
    });
};
