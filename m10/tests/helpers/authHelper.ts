import { generateAccessToken, generateRefreshToken } from '../../src/utils/jwt.js';
import type { SafeUser } from '../../src/types/auth.js';

export const createTestTokens = (user: SafeUser) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        accessToken,
        refreshToken,
    };
};

export const getAuthHeader = (accessToken: string) => {
    return `Bearer ${accessToken}`;
};
