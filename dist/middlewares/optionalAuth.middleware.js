"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../index")); // Import prisma from index.ts
// 선택적 인증 미들웨어
// 인증에 성공하면 사용자 정보를 추가하고 실패해도 에러없이 다음 미들웨어 진행
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return next();
        }
        const [tokenType, token] = authorization.split(' ');
        if (tokenType !== 'Bearer' || !token) {
            return next();
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = await index_1.default.user.findUnique({
            where: { id: decodedToken.userId },
        });
        if (user) {
            req.user = user;
        }
    }
    catch (error) {
        // 에러 발생 시에도 다음 미들웨어로 진행 (선택적 인증이므로)
        console.error('선택적 인증 미들웨어 에러:', error);
    }
    return next();
};
exports.default = optionalAuthMiddleware;
