"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getUserNotifications;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
async function getUserNotifications(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: req.user.id },
            include: {
                myNotification: true,
            },
        });
        res.status(200).json({
            data: { ...user?.myNotification },
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=get.user.notifications.js.map