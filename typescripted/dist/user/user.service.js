"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const error_1 = __importDefault(require("../lib/error"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    async getUserInfo({ id }) {
        const userId = id;
        const customerInfo = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!customerInfo)
            throw new error_1.default(404, "not found");
        return customerInfo;
    }
    async patchUserInfo(id, input) {
        const userId = id;
        const { email, nickname } = input;
        const isValid = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!isValid)
            throw { status: 404, message: "해당 유저는 유효하지않습니다" };
        const modifiedUserInfo = await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                email,
                nickname,
            },
            select: {
                id: true,
                email: true,
                nickname: true,
            },
        });
        return modifiedUserInfo;
    }
    async patchedPassword(id, input) {
        const userId = id;
        const { currentPassword, newPassword } = input;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new error_1.default(404, "not found");
        if (!user.password)
            throw new error_1.default(404, "not found 비밀번호");
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (isMatch)
            throw new error_1.default(400, "이전비밀번호와 같으면 안됩니다.");
        const newHash = await bcrypt_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                password: newHash,
            },
        });
        return { success: true, message: "비밀번호 변경 성공" };
    }
}
exports.UserService = UserService;
