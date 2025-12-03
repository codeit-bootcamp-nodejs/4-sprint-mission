"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.createSchema = void 0;
exports.create = create;
exports.update = update;
const zod_1 = require("zod");
const http_errors_1 = __importDefault(require("http-errors"));
exports.createSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
})
    .strict();
exports.updateSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
})
    .strict()
    .partial();
function create(req, res, next) {
    const result = exports.createSchema.safeParse(req.body);
    if (result.success) {
        next();
    }
    else {
        throw next((0, http_errors_1.default)(404, "입력값이 유효하지 않습니다."));
    }
}
function update(req, res, next) {
    const result = exports.updateSchema.safeParse(req.body);
    if (result.success) {
        next();
    }
    else {
        throw next((0, http_errors_1.default)(404, "입력값이 유효하지 않습니다."));
    }
}
//# sourceMappingURL=article.js.map