"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductUpdateSchema = exports.ProductCreateSchema = void 0;
const zod_1 = require("zod");
// CREATE DTO 
exports.ProductCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "이름을 입력해주세요" }),
    description: zod_1.z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }),
    price: zod_1.z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
    tags: zod_1.z.string().default(""),
});
// UPDATE DTO
exports.ProductUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "이름을 입력해주세요" }).optional(),
    description: zod_1.z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }).optional(),
    price: zod_1.z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }).optional(),
    tags: zod_1.z.string().default("").optional(),
});
// QUERY DTO
exports.ProductQuerySchema = zod_1.z.object({
    page: zod_1.z.string().default("1").transform(Number).refine((v) => v > 0),
    pageSize: zod_1.z.string().default("5").transform(Number).refine((v) => v > 0 && v <= 100),
    keyword: zod_1.z.string().default(""),
});
//# sourceMappingURL=product.dto.js.map