"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const createArticle = async (req, res, next) => {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const result = await prisma_js_1.default.article.create({
            data: {
                ...req.body,
                owner: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = createArticle;
//# sourceMappingURL=post.article.create.js.map