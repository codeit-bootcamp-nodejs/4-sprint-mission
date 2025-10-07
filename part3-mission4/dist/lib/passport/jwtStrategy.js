import { Strategy as JwtStrategy, ExtractJwt, } from 'passport-jwt';
import { prisma } from '../prismaClient.js';
import {} from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET, } from '../constants.js';
const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};
const refreshTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};
async function jwtVerify(payload, done) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}
export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
export const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);
//# sourceMappingURL=jwtStrategy.js.map