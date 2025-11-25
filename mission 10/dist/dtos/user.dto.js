"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPasswordSchema = exports.UserUpdateSchema = exports.UserLoginSchema = exports.UserRegisterSchema = void 0;
const zod_1 = require("zod");
// 회원가입
exports.UserRegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email" }),
    nickname: zod_1.z.string().min(2, { message: "Nickname too short" }),
    password: zod_1.z.string().min(6, { message: "Password too short" }),
});
// 로그인
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// 정보 수정 (PATCH)
exports.UserUpdateSchema = zod_1.z.object({
    nickname: zod_1.z.string().min(2).optional(),
    image: zod_1.z.string().url().optional(),
});
// 비밀번호 수정
exports.UserPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, { message: "Password too short" }),
});
//# sourceMappingURL=user.dto.js.map