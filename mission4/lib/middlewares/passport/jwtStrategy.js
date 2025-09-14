import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userService from '../../../src/services/userService.js';

const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload, done) {
    try {
        const user = await userService. getUserById(payload.userId);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

export default {
    accessTokenStrategy,
};
