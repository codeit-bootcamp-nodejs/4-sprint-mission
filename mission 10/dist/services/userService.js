"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository_1 = require("../repositories/userRepository");
const token_1 = require("../lib/token");
class UserService {
    constructor() {
        this.userRepo = new userRepository_1.UserRepository();
    }
    async register(data) {
        const exists = await this.userRepo.findByEmail(data.email);
        if (exists)
            throw new Error("EMAIL_EXISTS");
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        await this.userRepo.createUser(data.email, data.nickname, hashedPassword);
        return { message: "User registered successfully" };
    }
    async getProfile(userId) {
        return this.userRepo.findById(userId);
    }
    async updateInformation(userId, nickname, image) {
        const updateData = {};
        if (nickname)
            updateData.nickname = nickname;
        if (image)
            updateData.image = image;
        if (Object.keys(updateData).length === 0)
            throw new Error("NO_DATA");
        return this.userRepo.updateUser(userId, updateData);
    }
    async updatePassword(userId, data) {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        await this.userRepo.updateUser(userId, { password: hashedPassword });
        return { message: "Password updated successfully" };
    }
    async getProducts(userId) {
        return this.userRepo.findProductsByUserId(userId);
    }
    generateUserTokens(userId) {
        return (0, token_1.generateTokens)(userId);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map