"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const deleteArticle = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        await prisma_js_1.default.article.delete({
            where: { id: reqId, ownerId: req.user.id },
        });
        res.status(200).json({ message: "Delete Success" });
    }
    catch (err) {
        next(err);
    }
};
exports.default = deleteArticle;
//# sourceMappingURL=delete.article.js.map