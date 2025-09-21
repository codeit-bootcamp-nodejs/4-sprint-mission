"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class ArticleRepository {
    async findArticleById(id) {
        return index_1.default.article.findUnique({ where: { id } });
    }
    async findArticles(options) {
        return index_1.default.article.findMany(options);
    }
    async createArticle(data) {
        return index_1.default.article.create({ data });
    }
    async updateArticle(id, data) {
        return index_1.default.article.update({ where: { id }, data });
    }
    async deleteArticle(id) {
        return index_1.default.article.delete({ where: { id } });
    }
}
exports.default = ArticleRepository;
