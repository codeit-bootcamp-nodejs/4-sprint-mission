import { z } from "zod";
import createError from "http-errors";
const createSchema = z
    .object({
    content: z.string().min(1),
})
    .strict();
export function create(req, res, next) {
    const result = createSchema.safeParse(req.body);
    if (result.success) {
        return next();
    }
    else {
        return next(createError(400, `잘못된 입력값입니다.`));
    }
}
//# sourceMappingURL=comment.js.map