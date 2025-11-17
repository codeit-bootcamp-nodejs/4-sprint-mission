"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateUserChangePassword;
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
async function updateUserChangePassword(req, res, next) {
    try {
        const password = req.body.password;
        if (!req.user) {
            return next((0, http_errors_1.default)(401, "Unauthorized"));
        }
        const data = await prisma_js_1.default.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                password,
            },
        });
        if (!data) {
            return next((0, http_errors_1.default)(404, "유저를 찾을 수 없습니다."));
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, data.password);
        if (!isPasswordValid) {
            return next((0, http_errors_1.default)(400, "암호가 올바르지 않음"));
        }
        await prisma_js_1.default.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                password: password,
            },
        });
        res.status(200).json({ message: "변경 성공함" });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=update.user.change.password.js.map