"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateUserNotification;
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
async function updateUserNotification(req, res, next) {
    try {
        if (!req.user) {
            return next((0, http_errors_1.default)(401, "Unauthorized"));
        }
        const notiId = req.params.id;
        const data = await prisma_js_1.default.notification.update({
            where: {
                id: Number(notiId),
            },
            data: {
                isRead: true,
            },
        });
        res.status(200).json({ message: "변경 성공함" });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=update.user.notification.js.map