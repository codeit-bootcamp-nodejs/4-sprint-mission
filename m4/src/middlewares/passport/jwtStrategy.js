import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as authService from '../../services/authService.js';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
} from '../../config/constants.js';

const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refresTokenOptions = {
    jwtFromRequest: (req) => req?.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload, done) {
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
        return done(error);
    }
}

export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
export const refreshTokenStrategy = new JwtStrategy(refresTokenOptions, jwtVerify);
