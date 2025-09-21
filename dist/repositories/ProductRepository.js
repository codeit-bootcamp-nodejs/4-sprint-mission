"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class ProductRepository {
    async findProductById(id) {
        return index_1.default.product.findUnique({ where: { id } });
    }
    async findProducts(options) {
        return index_1.default.product.findMany(options);
    }
    async createProduct(data) {
        return index_1.default.product.create({ data });
    }
    async updateProduct(id, data) {
        return index_1.default.product.update({ where: { id }, data });
    }
    async deleteProduct(id) {
        return index_1.default.product.delete({ where: { id } });
    }
}
exports.default = ProductRepository;
