"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
const zod_1 = require("zod");
const http_errors_1 = __importDefault(require("http-errors"));
const createSchema = zod_1.z
    .object({
    content: zod_1.z.string().min(1),
})
    .strict();
function create(req, res, next) {
    const result = createSchema.safeParse(req.body);
    if (result.success) {
        return next();
    }
    else {
        return next((0, http_errors_1.default)(400, `잘못된 입력값입니다.`));
    }
}
//# sourceMappingURL=comment.js.map