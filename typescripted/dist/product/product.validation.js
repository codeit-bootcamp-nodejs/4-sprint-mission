"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateProduct = void 0;
const zod_1 = require("zod");
class ValidateProduct {
    // zod schema
    static productTagSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().min(0, { message: "인덱스는 0 이상이어야 합니다" }),
        name: zod_1.z.string().min(2, { message: "제품 제목 2자 이상" }),
    });
    static productParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().min(0, { message: "제품 인덱스는 0 이상" })
    });
    static productQuerySchema = zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => val ? Number(val) : 1),
        take: zod_1.z.string().optional().transform(val => val ? Number(val) : 10)
    });
    static productBodySchema = zod_1.z.object({
        name: zod_1.z.string().min(2, { message: "제품 제목 2자 이상" }),
        description: zod_1.z.string().min(10, { message: "제품 설명란 10자 이상" }).nullable(),
        price: zod_1.z.string().regex(/^\d+$/).min(1000, { message: "제품 가격 1000원 이상" }),
        productTags: zod_1.z.array(this.productTagSchema),
        ownerId: zod_1.z.number(), // owner 전체 말고 그냥 id만 받음
    });
    // validate 
    static validateBody = (req, _res, next) => {
        try {
            const result = this.productBodySchema.parse(req.body);
            req.validatedBody = result;
            console.log("req.validatedBody: ", req.validatedBody);
            next(result);
        }
        catch (error) {
            next(error);
        }
    };
    static validateQuery = (req, _res, next) => {
        try {
            const result = this.productQuerySchema.parse(req.query);
            req.validatedQuery = result;
            console.log("validated Query: ", req.validatedQuery);
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static validateParams = (req, _res, next) => {
        try {
            const result = this.productParamsSchema.parse(req.params);
            req.validatedParams = result; // parse qs
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ValidateProduct = ValidateProduct;
