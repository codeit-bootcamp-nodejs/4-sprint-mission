"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleValidation = void 0;
const zod_1 = require("zod");
class articleValidation {
    // zod스키마
    static articleQuerySchema = zod_1.z.object({
        ownerId: zod_1.z.coerce
            .number()
            .min(0, { message: "인덱스는 0 보다 크거나 같아야 합니다" }),
        page: zod_1.z.coerce
            .number()
            .min(10, { message: "take number must be the bigger than 10" }),
        take: zod_1.z.coerce
            .number()
            .min(1, { message: "page number must be the bigger than 1" }),
        keyword: zod_1.z.enum(["content", "title"]).optional(),
    });
    static articleBodySchema = zod_1.z.object({
        content: zod_1.z
            .string()
            .min(10, { message: "본문 의 길이는 10글자 이상이어야합니다" }),
        title: zod_1.z
            .string()
            .min(10, { message: "제목 의 길이는 10글자 이상이어야합니다" }),
    });
    static articleParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce
            .number()
            .min(0, { message: "인덱스는 0 보다 크거나 같아야 합니다" }),
    });
    // validator
    static validateArticleById = (req, _res, next) => {
        try {
            const result = this.articleParamsSchema.parse(req.params);
            req.validatedParams = result;
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validateGetArticleList = (req, _res, next) => {
        try {
            const result = this.articleQuerySchema.parse(req.query);
            req.validatedQuery = result;
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validatCreateArticle = (req, _res, next) => {
        try {
            const result = this.articleBodySchema.parse(req.body);
            next(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.articleValidation = articleValidation;
