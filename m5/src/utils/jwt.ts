import jwt from 'jsonwebtoken';
import type { SafeUser } from '../types/auth.js';

import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
} from '../config/constants.js';

export const generateAccessToken = (user: SafeUser): string => {
    const payload = { userId: user.id };
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
};

export const generateRefreshToken = (user: SafeUser): string => {
    const payload = { userId: user.id };
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
};
