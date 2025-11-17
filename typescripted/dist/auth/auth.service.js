"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../lib/constants");
class AuthService {
    async createUser(input) {
        const { nickname, password, email } = input;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                nickname,
                password: hashedPassword,
                email,
            },
            select: {
                nickname: true,
                email: true,
            },
        });
        return newUser;
    }
    async loginUser(input) {
        const { nickname, password, email } = input;
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [{ email: email }, { nickname: nickname }],
            },
        });
        if (!user)
            throw { status: 404, message: "not found" };
        // user.password null 체크
        if (!user.password)
            throw { status: 400, message: "비밀번호가 설정되지 않았습니다." };
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw { status: 400, message: "비밀번호 확인" };
    }
    generateToken(userId) {
        const accessToken = jsonwebtoken_1.default.sign({ sub: userId }, constants_1.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: "30mins",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: userId }, constants_1.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: "1d",
        });
    }
    verifyAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_ACCESS_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
    verifyRefreshToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_REFRESH_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
}
exports.AuthService = AuthService;
