"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArticlesController_1 = __importDefault(require("../controllers/ArticlesController"));
const ArticleService_1 = __importDefault(require("../ArticleService"));
const ArticleRepository_1 = __importDefault(require("../repositories/ArticleRepository"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const optionalAuth_middleware_1 = __importDefault(require("../middlewares/optionalAuth.middleware"));
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
// Initialize repositories and services
const articleRepository = new ArticleRepository_1.default();
const articleService = new ArticleService_1.default(articleRepository);
const articlesController = new ArticlesController_1.default(articleService);
//article registration 
router
    .route('/articles')
    .post(auth_middleware_1.default, validation_middleware_1.validateArticle, articlesController.createArticle)
    // 게시글 목록 조회
    .get(optionalAuth_middleware_1.default, articlesController.getArticles);
// article detail, modify, delete
router
    .route('/articles/:articleId')
    .get(optionalAuth_middleware_1.default, articlesController.getArticleById)
    .patch(auth_middleware_1.default, validation_middleware_1.validateArticle, articlesController.updateArticle)
    .delete(auth_middleware_1.default, articlesController.deleteArticle);
// article comment creation 
router.post('/articles/:articleId/comments', auth_middleware_1.default, articlesController.createComment);
// article comments check
router.get('/articles/:articleId/comments', articlesController.getComments);
//article comment modify
router.patch('/articles/comments/:commentId', auth_middleware_1.default, articlesController.updateComment);
//article comment delete
router.delete('/articles/comments/:commentId', auth_middleware_1.default, articlesController.deleteComment);
// 게시글 좋아요 API
router.post('/:articleId/like', auth_middleware_1.default, articlesController.toggleLike);
exports.default = router;
