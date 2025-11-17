"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const localStrategy_js_1 = require("./localStrategy.js");
const jwtStrategy_js_1 = require("./jwtStrategy.js");
const jwt_tokens_js_1 = __importDefault(require("../constants/jwt.tokens.js"));
passport_1.default.use("local", localStrategy_js_1.localStrategy);
passport_1.default.use(jwt_tokens_js_1.default.ACCESS_TOKEN_COOKIE_NAME, jwtStrategy_js_1.accessTokenStrategy);
passport_1.default.use(jwt_tokens_js_1.default.REFRESH_TOKEN_COOKIE_NAME, jwtStrategy_js_1.refreshTokenStrategy);
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await prisma.user.findUnique({ where: { id } });
//   done(null, user);
// });
const passports = {
    passport: passport_1.default,
    local: passport_1.default.authenticate("local", { session: false }),
    jwtAccess: passport_1.default.authenticate(jwt_tokens_js_1.default.ACCESS_TOKEN_COOKIE_NAME, {
        session: false,
        failureRedirect: "/user/refresh",
    }),
    jwtRefresh: passport_1.default.authenticate(jwt_tokens_js_1.default.REFRESH_TOKEN_COOKIE_NAME, {
        session: false,
    }),
};
exports.default = passports;
//# sourceMappingURL=index.js.map