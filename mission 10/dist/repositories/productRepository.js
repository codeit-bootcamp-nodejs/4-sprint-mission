"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ProductRepository {
    async createProduct(data) {
        return prisma_1.default.product.create({ data });
    }
    async findMany(where, skip, take) {
        return prisma_1.default.product.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
            where,
        });
    }
    async findById(id) {
        return prisma_1.default.product.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        });
    }
    async updateProduct(id, data) {
        return prisma_1.default.product.update({ where: { id }, data });
    }
    async deleteProduct(id) {
        return prisma_1.default.product.delete({ where: { id } });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=productRepository.js.map