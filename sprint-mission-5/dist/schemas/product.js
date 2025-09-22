import { z } from "zod";
import createError from "http-errors";
const createSchema = z
    .object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    tags: z.array(z.string()),
})
    .strict();
export const updateSchema = z
    .object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    tags: z.array(z.string()),
})
    .partial();
export function create(req, res, next) {
    const result = createSchema.safeParse(req.body);
    if (result.success) {
        next();
    }
    else {
        throw next(createError(404, "입력값이 유효하지 않습니다."));
    }
}
export function update(req, res, next) {
    const result = updateSchema.safeParse(req.body);
    if (result.success) {
        next();
    }
    else {
        throw next(createError(404, "입력값이 유효하지 않습니다."));
    }
}
//# sourceMappingURL=product.js.map