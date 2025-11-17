"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
class CommentValidation {
    // zod 스키마
    static CommentBodySchema = zod_1.default.object({
        content: zod_1.default.string().min(1, { message: "Comment content is required" }),
        title: zod_1.default.string().min(1, { message: "Comment title is required" }),
    });
    static commentIdParamSchema = zod_1.default.object({
        id: zod_1.default.coerce.number().min(0, { message: "Comment ID must be an integer" }),
    });
    static commentQuerySchema = zod_1.default.object({
        type: zod_1.default
            .string({ message: "Comment type must be an string" })
            .transform((val) => {
            val.toUpperCase();
        }),
        take: zod_1.default
            .coerce
            .number()
            .min(10, { message: "take number must be the bigger than 10" }),
        page: zod_1.default
            .coerce
            .number()
            .min(1, { message: "page number must be the bigger than 1" }),
        prouductId: zod_1.default
            .coerce
            .number()
            .min(0, { message: "product 인덱스는 0 보다 크거나 같아야 합니다" }),
        articleId: zod_1.default
            .coerce
            .number()
            .min(0, { message: "article 인덱스는 0 보다 크거나 같아야 합니다" }),
    });
    // validator
    static validateCommentById = (req, _res, next) => {
        try {
            const result = this.commentIdParamSchema.safeParse(req.params);
            next(result);
        }
        catch (error) {
            next();
        }
    };
    static validateGetCommentList = (req, _res, next) => {
        try {
            const result = this.commentQuerySchema.safeParse(req.query);
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validateCreateComment = (req, _res, next) => {
        try {
            const result = this.CommentBodySchema.safeParse(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = CommentValidation;
