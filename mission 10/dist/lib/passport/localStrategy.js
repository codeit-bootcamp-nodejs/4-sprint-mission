"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = void 0;
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma"));
exports.localStrategy = new passport_local_1.Strategy({
    usernameField: "email", // email을 localStrategy의 고정값 'username' 대신 쓰도록 지정
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false, { message: "No user found" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
});
//# sourceMappingURL=localStrategy.js.map