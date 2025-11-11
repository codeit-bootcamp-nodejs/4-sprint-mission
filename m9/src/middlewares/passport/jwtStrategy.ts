import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { Request } from 'express';
import * as authService from '../../services/authService.js';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
} from '../../config/constants.js';

interface JwtPayload {
    userId: number;
}

interface JwtVerifyCallback {
    (error: Error | null, user?: unknown, info?: unknown): void;
}

const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_ACCESS_TOKEN_SECRET as string,
};

const refresTokenOptions = {
    jwtFromRequest: (req: Request) => req?.cookies?.[JWT_REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET as string,
};

async function jwtVerify(payload: JwtPayload, done: JwtVerifyCallback) {
    try {
        const userId = payload.userId;
        if (!userId) {
            return done(null, false, { message: 'Invalid token' });
        }

        const user = await authService.getUserById(userId);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}

export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
export const refreshTokenStrategy = new JwtStrategy(refresTokenOptions, jwtVerify);
