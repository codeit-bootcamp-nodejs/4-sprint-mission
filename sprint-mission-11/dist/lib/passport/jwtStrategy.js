"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenStrategy = exports.accessTokenStrategy = void 0;
const jwt_tokens_js_1 = __importDefault(require("../constants/jwt.tokens.js"));
const passport_jwt_1 = require("passport-jwt");
const prisma_js_1 = __importDefault(require("../prisma.js"));
const accessTokenOptions = {
    jwtFromRequest: (req) => req.cookies[jwt_tokens_js_1.default.ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: jwt_tokens_js_1.default.JWT_ACCESS_TOKEN_SECRET,
};
const refreshTokenOptions = {
    jwtFromRequest: (req) => req.cookies[jwt_tokens_js_1.default.REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: jwt_tokens_js_1.default.JWT_REFRESH_TOKEN_SECRET,
};
async function jwtVerify(payload, done) {
    try {
        console.log("jwt 인증 시작, payload : " + payload.id);
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
            },
        });
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
}
exports.accessTokenStrategy = new passport_jwt_1.Strategy(accessTokenOptions, jwtVerify);
exports.refreshTokenStrategy = new passport_jwt_1.Strategy(refreshTokenOptions, jwtVerify);
//# sourceMappingURL=jwtStrategy.js.map