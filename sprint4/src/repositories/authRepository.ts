// src/repositories/authRepository.ts
import { PrismaClient, User } from '@prisma/client';
import { UserUpdate } from '../types';

const prisma = new PrismaClient();

// --- 사용자(User) 관련 ---
export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
    });
};

export const findUserWithPasswordById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: { email: string; nickname: string; password: string; }) => {
    return prisma.user.create({ data });
};

export const updateUser = async (id: number, data: UserUpdate) => {
    return prisma.user.update({
        where: { id },
        data,
        select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
    });
};

export const updateUserPassword = async (id: number, password: string) => {
    return prisma.user.update({
        where: { id },
        data: { password },
    });
};


// --- 리프레시 토큰(RefreshToken) 관련 ---
export const findRefreshTokenByToken = async (token: string) => {
    return prisma.refreshToken.findUnique({
        where: { token },
        include: {
            user: {
                select: { id: true, email: true },
            },
        },
    });
};

export const createRefreshToken = async (token: string, userId: number) => {
    return prisma.refreshToken.create({ data: { token, userId } });
};

export const deleteRefreshToken = async (token: string) => {
    return prisma.refreshToken.deleteMany({ where: { token } });
};

export const deleteRefreshTokensByUserId = async (userId: number) => {
    return prisma.refreshToken.deleteMany({ where: { userId } });
};