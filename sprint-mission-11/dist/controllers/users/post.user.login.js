"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginUser;
const token_js_1 = require("../../lib/token.js");
const index_js_1 = __importDefault(require("../../lib/passport/index.js"));
function loginUser(req, res, next) {
    index_js_1.default.passport.authenticate("local", { session: false }, (err, user, info) => {
        console.log("로그인 시도");
        if (err)
            return next(err);
        if (!req.user)
            return res.status(401).json({ message: "로그인 실패, 유저 없음" });
        const tokens = (0, token_js_1.setJwtTokens)(String(req.user.id), res);
        res.status(200).json({
            message: "로그인",
            data: {
                accessHeader: tokens.accessToken,
                refreshHeader: tokens.refreshToken,
            },
        });
    })(req, res, next);
}
//# sourceMappingURL=post.user.login.js.map