import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateUserData } from '../types/auth.js';

type PrismaTransaction = Prisma.TransactionClient;

/** 유저 생성 */
export const createUser = async (userData: CreateUserData, tx: PrismaTransaction = prisma) => {
    return tx.user.create({
        data: userData,
    });
};

/** ID로 유저 조회 */
export const findUserById = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.user.findUnique({
        where: { id },
    });
};

/** 이메일로 유저 조회 */
export const findUserByEmail = async (email: string, tx: PrismaTransaction = prisma) => {
    return tx.user.findUnique({
        where: { email },
    });
};
