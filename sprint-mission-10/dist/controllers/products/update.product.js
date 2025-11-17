"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const socket_manager_js_1 = require("../../lib/socket-manager.js");
const updateProduct = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const product = await prisma_js_1.default.product.update({
            where: { id: reqId, ownerId: req.user.id },
            data: req.body,
        });
        if (req.body.price) {
            const result = await prisma_js_1.default.product.findUnique({
                where: { id: reqId },
                select: {
                    likedUsers: true,
                },
            });
            if (!result)
                return;
            const ids = result?.likedUsers.map((item) => item.id);
            (0, socket_manager_js_1.sendAdHocGroupNotification)(ids, "가격이 변경되었습니다.");
        }
        res.status(200).send(product);
    }
    catch (err) {
        next(err);
    }
};
exports.default = updateProduct;
//# sourceMappingURL=update.product.js.map