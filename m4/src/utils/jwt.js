import jwt from 'jsonwebtoken';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
} from '../config/constants.js';

export const generateAccessToken = (user) => {
    const payload = { userId: user.id };
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};

export const generateRefreshToken = (user) => {
    const payload = { userId: user.id };
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
};
