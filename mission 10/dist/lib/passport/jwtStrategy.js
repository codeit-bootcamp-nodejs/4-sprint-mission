"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenStrategy = exports.accessTokenStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const prisma_1 = __importDefault(require("../prisma"));
const constants_1 = require("../constants");
// const accessTokenOptions = {
//   jwtFromRequest: (req: Request) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
//   secretOrKey: JWT_ACCESS_TOKEN_SECRET,
// };
const accessTokenOptions = {
    jwtFromRequest: (req) => {
        return req.cookies[constants_1.ACCESS_TOKEN_COOKIE_NAME] || passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    },
    secretOrKey: constants_1.JWT_ACCESS_TOKEN_SECRET,
};
const refreshTokenOptions = {
    jwtFromRequest: (req) => req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: constants_1.JWT_REFRESH_TOKEN_SECRET,
};
async function jwtVerify(payload, done) {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.sub },
        });
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}
exports.accessTokenStrategy = new passport_jwt_1.Strategy(accessTokenOptions, jwtVerify);
exports.refreshTokenStrategy = new passport_jwt_1.Strategy(refreshTokenOptions, jwtVerify);
//# sourceMappingURL=jwtStrategy.js.map