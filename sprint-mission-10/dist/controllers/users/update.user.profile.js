"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const updateUserProfile = async (req, res, next) => {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const result = await prisma_js_1.default.user.update({
            where: { id: req.user.id },
            data: req.body,
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = updateUserProfile;
//# sourceMappingURL=update.user.profile.js.map