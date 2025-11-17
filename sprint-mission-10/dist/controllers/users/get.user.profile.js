"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getUserProfile;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
async function getUserProfile(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                email: true,
                nickname: true,
                image: true,
                myProducts: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true,
            },
        });
        res.status(200).json({
            data: { ...user },
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=get.user.profile.js.map