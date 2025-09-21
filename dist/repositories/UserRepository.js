"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class UserRepository {
    async findUserById(id) {
        return index_1.default.user.findUnique({ where: { id } });
    }
    async findUserByEmail(email) {
        return index_1.default.user.findUnique({ where: { email } });
    }
    async createUser(data) {
        return index_1.default.user.create({ data });
    }
    async updateUser(id, data) {
        return index_1.default.user.update({ where: { id }, data });
    }
    async deleteUser(id) {
        return index_1.default.user.delete({ where: { id } });
    }
    async findProductsByUserId(userId) {
        const userWithProducts = await index_1.default.user.findUnique({
            where: { id: userId },
            include: { products: true },
        });
        return userWithProducts ? userWithProducts.products : null;
    }
}
exports.default = UserRepository;
