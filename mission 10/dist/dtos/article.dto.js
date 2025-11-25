"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleQuerySchema = exports.ArticleUpdateSchema = exports.ArticleCreateSchema = void 0;
const zod_1 = require("zod");
// CREATE DTO
exports.ArticleCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "제목을 입력해주세요" }),
    content: zod_1.z
        .string()
        .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
        .max(200, { message: "내용은 최대 200자까지 가능합니다." }),
});
// UPDATE DTO (PATCH)
exports.ArticleUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "제목을 입력해주세요" }).optional(),
    content: zod_1.z
        .string()
        .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
        .max(200, { message: "내용은 최대 200자까지 가능합니다." })
        .optional(),
});
// QUERY DTO (GET /articles)
exports.ArticleQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .default("1")
        .transform(Number)
        .refine((val) => val > 0, { message: "page는 1 이상의 정수여야 합니다." }),
    pageSize: zod_1.z
        .string()
        .default("5")
        .transform(Number)
        .refine((val) => val > 0 && val <= 100, { message: "pageSize는 1~100 사이여야 합니다." }),
    keyword: zod_1.z.string().default(""),
});
//# sourceMappingURL=article.dto.js.map