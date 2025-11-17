"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidate = void 0;
const zod_1 = require("zod");
class AuthValidate {
    // zod 스키마
    static registerUserSchema = zod_1.z.object({
        email: zod_1.z
            .string()
            .regex(/^[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i, "올바른 이메일 형식이 아닙니다."),
        nickname: zod_1.z.string().regex(/^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{3,10}$/, "닉네임은 3자에서 10자 이하이어야 합니다"),
        password: zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9\W_]{8,15}$/, "비밀번호는 영문 숫자, 특수 문자 포함해서 8 +15자리 여아 합니다")
    });
    static loginUserSchema = zod_1.z.object({
        email: zod_1.z.string().email("올바른 이메일 형식이 아닙니다."),
        password: zod_1.z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    });
    // owner schema 
    static ownerSchema = zod_1.z.object({
        id: zod_1.z.number(),
        nickname: zod_1.z.string(),
        email: zod_1.z.string().email()
    });
    // validator
    static validateCreateUser = (req, res, next) => {
        try {
            const result = this.registerUserSchema.parse(req.body);
            req.body = result;
        }
        catch (error) {
            next(error);
        }
    };
    static validateLogin = (req, res, next) => {
        try {
            const result = this.loginUserSchema.parse(req.body);
            req.body = result;
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthValidate = AuthValidate;
