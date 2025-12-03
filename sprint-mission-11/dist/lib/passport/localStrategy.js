"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = void 0;
const passport_local_1 = __importDefault(require("passport-local"));
const prisma_js_1 = __importDefault(require("../prisma.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const LocalStrategy = passport_local_1.default.Strategy;
exports.localStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        // console.log(`로그인 시도 : ${email}, ${password}`);
        const user = await prisma_js_1.default.user.findUnique({ where: { email: email } });
        if (!user) {
            return done(null, false, { message: "유저 못찾음" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "비밀번호 오류" });
        }
        done(null, user);
    }
    catch (err) {
        console.error("에러 : " + err);
        return done(err);
    }
});
//# sourceMappingURL=localStrategy.js.map