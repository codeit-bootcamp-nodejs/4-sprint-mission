"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
    // zod 스키마
    static userParamsSchema = zod_1.z.object({
        id: zod_1.z
            .coerce
            .number()
            .min(0, { message: "Comment ID must be an integer" }),
    });
    //private static userQuerySchema(){}
    static userBodySchema = zod_1.z.object({
        email: zod_1.z
            .string()
            .regex(/^[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i, "올바른 이메일 형식이 아닙니다.").optional(),
        nickname: zod_1.z
            .string()
            .regex(/^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{3,10}$/, "닉네임은 3자에서 10자 이하이어야 합니다").optional(),
    });
    static userBodyPasswordSchema = zod_1.z.object({
        currentPassword: zod_1.z
            .string()
            .min(8, "현재 비밀번호는 최소 8자리 이상이어야 합니다"),
        newPassword: zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9\W_]{8,15}$/, "비밀번호는 영문 숫자, 특수 문자 포함해서 8 +15자리 여아 합니다")
    });
    // validator
    static validateUserAccessById = (req, _res, next) => {
        try {
            const result = this.userParamsSchema.parse(req.params);
            req.validatedParams = result; // overwritting
            //console.log(result)
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validateUpdateUserPassword = (req, _res, next) => {
        try {
            const result = this.userBodyPasswordSchema.parse(req.body);
            req.validatedBody = result;
            console.log(result);
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validateUpdateUser = (req, _res, next) => {
        try {
            const result = this.userBodySchema.parse(req.body);
            req.validatedQuery = result;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserValidation = UserValidation;
