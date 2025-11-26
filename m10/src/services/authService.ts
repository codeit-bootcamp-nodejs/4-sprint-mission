import prisma from '../config/prisma.js';
import * as authRepository from '../repositories/authRepository.js';
import * as tokenRepository from '../repositories/tokenRepository.js';
import * as bcryptUtils from '../utils/bcrypt.js';
import * as jwtUtils from '../utils/jwt.js';
import * as userUtils from '../utils/user.js';
import { CustomError } from '../middlewares/errorHandler.js';
import { JWT_REFRESH_TOKEN_EXPIRES_IN_MS } from '../config/constants.js';

import type { SafeUser } from '../types/auth.js';

const generateTokens = (user: SafeUser) => {
    const accessToken = jwtUtils.generateAccessToken(user);
    const refreshToken = jwtUtils.generateRefreshToken(user);
    const expiredAt = new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRES_IN_MS);
    return { accessToken, refreshToken, expiredAt };
};

export const signup = async (email: string, nickname: string, password: string) => {
    return prisma.$transaction(async (tx) => {
        const existingUser = await authRepository.findUserByEmail(email, tx);
        if (existingUser) throw new CustomError('이미 가입된 이메일입니다.', 409);

        const hashedPassword = await bcryptUtils.hashPassword(password);
        const newUser = await authRepository.createUser({ email, nickname, password: hashedPassword }, tx);

        return userUtils.omitPassword(newUser);
    });
};

export const getUserById = async (userId: number) => {
    const user = await authRepository.findUserById(userId);
    return user ? userUtils.omitPassword(user) : null;
};

export const findUserAndVerifyPassword = async (email: string, password: string) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) return null;

    const isMatch = await bcryptUtils.comparePassword(password, user.password);
    if (!isMatch) return null;

    return userUtils.omitPassword(user);
};

export const login = async (user: SafeUser) => {
    return prisma.$transaction(async (tx) => {
        const { accessToken, refreshToken, expiredAt } = generateTokens(user);

        // 기존 토큰 삭제 후 새 토큰 저장
        await tokenRepository.deleteTokensByUserId(user.id, tx);
        await tokenRepository.createRefreshToken(refreshToken, user.id, expiredAt, tx);

        return { accessToken, refreshToken };
    });
};

export const refresh = async (refreshTokenFromClient: string) => {
    return prisma.$transaction(async (tx) => {
        const storedToken = await tokenRepository.findRefreshToken(refreshTokenFromClient, tx);
        if (!storedToken) throw new CustomError('Refresh Token이 만료되었거나 존재하지 않습니다.', 404);

        const user = await authRepository.findUserById(storedToken.userId, tx);
        if (!user) throw new CustomError('해당 사용자가 존재하지 않습니다.', 404);

        const { accessToken, refreshToken, expiredAt } = generateTokens(user);

        // 기존 토큰 삭제
        await tokenRepository.deleteTokensByUserId(storedToken.userId, tx);

        // 새 토큰 DB 저장
        await tokenRepository.createRefreshToken(refreshToken, user.id, expiredAt, tx);

        return { accessToken, refreshToken };
    });
};

export const logout = async (refreshTokenFromClient: string) => {
    return prisma.$transaction(async (tx) => {
        return tokenRepository.deleteRefreshToken(refreshTokenFromClient, tx);
    });
};
