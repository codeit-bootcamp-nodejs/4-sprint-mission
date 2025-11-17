"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logoutUser;
const token_js_1 = require("../../lib/token.js");
const http_errors_1 = __importDefault(require("http-errors"));
function logoutUser(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "비인가 유저"));
    }
    (0, token_js_1.clearJwtTokenCookies)(res);
    res.status(200).json({ message: "로그아웃" });
}
//# sourceMappingURL=post.user.logout.js.map