"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const token_js_1 = require("../../lib/token.js");
function userTokenRefresh(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const tokens = (0, token_js_1.setJwtTokens)(String(req.user.id), res);
        res.status(200).json({
            message: "세션 갱신",
            data: {
                accessHeader: tokens.accessToken,
                refreshHeader: tokens.refreshToken,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
exports.default = userTokenRefresh;
//# sourceMappingURL=get.user.token.refresh.js.map