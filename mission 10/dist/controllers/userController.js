"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userService_1 = require("../services/userService");
const cookieUtil_1 = require("../lib/cookieUtil");
const user_dto_1 = require("../dtos/user.dto");
const userService = new userService_1.UserService();
class UserController {
    async register(req, res, next) {
        try {
            const parsed = user_dto_1.UserRegisterSchema.parse(req.body);
            const result = await userService.register(parsed);
            res.status(http_status_1.default.CREATED).json(result);
        }
        catch (err) {
            if (err.message === "EMAIL_EXISTS") {
                return res.status(http_status_1.default.CONFLICT).json({ message: "This ID already exists" });
            }
            next(err);
        }
    }
    login(req, res, next) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        try {
            const { accessToken, refreshToken } = userService.generateUserTokens(req.user.id);
            (0, cookieUtil_1.setTokenCookies)(res, accessToken, refreshToken);
            res.status(http_status_1.default.OK).json({ accessToken, refreshToken });
        }
        catch (err) {
            next(err);
        }
    }
    async profile(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const profile = await userService.getProfile(req.user.id);
            res.status(http_status_1.default.OK).json(profile);
        }
        catch (err) {
            next(err);
        }
    }
    async modifyInformation(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = user_dto_1.UserUpdateSchema.parse(req.body); // DTO 검증
            const updatedUser = await userService.updateInformation(req.user.id, parsed.nickname, parsed.image);
            res.status(http_status_1.default.OK).json({ message: "User information updated successfully", user: updatedUser });
        }
        catch (err) {
            if (err.message === "NO_DATA")
                return res.status(http_status_1.default.BAD_REQUEST).json({ message: "No update data provided" });
            next(err);
        }
    }
    async modifyPassword(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = user_dto_1.UserPasswordSchema.parse(req.body); // DTO 검증
            const result = await userService.updatePassword(req.user.id, parsed);
            res.status(http_status_1.default.OK).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async products(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const products = await userService.getProducts(req.user.id);
            if (!products || products.length === 0) {
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "No product" });
            }
            res.status(http_status_1.default.OK).json(products);
        }
        catch (err) {
            next(err);
        }
    }
    refreshTokens(req, res) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        const { accessToken, refreshToken } = userService.generateUserTokens(req.user.id);
        (0, cookieUtil_1.setTokenCookies)(res, accessToken, refreshToken);
        res.status(http_status_1.default.OK).send({ message: "Tokens refreshed" });
    }
    logout(req, res) {
        (0, cookieUtil_1.clearTokenCookies)(res);
        res.status(http_status_1.default.OK).send({ message: "Logged out successfully" });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map