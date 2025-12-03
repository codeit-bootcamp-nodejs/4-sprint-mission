"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUser;
const password_js_1 = require("../../lib/password.js");
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
async function createUser(req, res, next) {
    const { email, nickname, password } = req.body;
    try {
        const hashedPassword = await (0, password_js_1.hashPassword)(password);
        const user = await prisma_js_1.default.user.create({
            data: {
                email: email,
                password: hashedPassword,
                nickname: nickname,
            },
        });
        res.status(201).json({ message: "회원가입\n" + user });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=post.user.register.js.map