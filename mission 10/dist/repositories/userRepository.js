"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class UserRepository {
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
        });
    }
    async createUser(email, nickname, password) {
        return prisma_1.default.user.create({ data: { email, nickname, password } });
    }
    async updateUser(id, data) {
        return prisma_1.default.user.update({ where: { id }, data });
    }
    async findProductsByUserId(userId) {
        return prisma_1.default.product.findMany({
            where: { userId },
            select: { name: true, description: true, price: true, tags: true },
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map