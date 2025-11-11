import prisma from '../config/prisma.js';
import { Prisma } from '@prisma/client';

type PrismaTransaction = Prisma.TransactionClient;

export const findUserByEmail = async (email: string, tx: PrismaTransaction = prisma) => {
    return tx.user.findUnique({
        where: {
            email,
        },
    });
};

export const findUserById = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.user.findUnique({
        where: {
            id,
        },
    });
};

export const updateUser = async (id: number, data: Prisma.UserUpdateInput, tx: PrismaTransaction = prisma) => {
    return tx.user.update({
        where: {
            id,
        },
        data,
    });
};

export const updateUserPassword = async (id: number, password: string, tx: PrismaTransaction = prisma) => {
    return tx.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
    });
};

