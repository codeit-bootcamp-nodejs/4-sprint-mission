"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var like_controller_js_1 = require("../controller/like-controller.js");
var article_controller_js_1 = require("../controller/article-controller.js");
var article_middleware_js_1 = require("../middleware/article-middleware.js");
var auth_middleware_js_1 = require("../middleware/auth-middleware.js");
var passport_1 = require("passport");
var ArticleRouter = express_1.default.Router();
//article API routing
ArticleRouter.get('/', article_controller_js_1.default.getArticles);
ArticleRouter.get('/detail/:id', passport_1.default.authenticate('AccessToken', { session: false }), article_middleware_js_1.default.ValidateId, article_controller_js_1.default.getOneArticle);
ArticleRouter.post('/', article_middleware_js_1.default.ArticleValid, article_middleware_js_1.default.ValidateForm, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkAuthenticated, article_controller_js_1.default.postArticle);
ArticleRouter.patch('detail/:id', article_middleware_js_1.default.ValidateId, article_middleware_js_1.default.ValidateForm, auth_middleware_js_1.checkArticleAuthorize, article_controller_js_1.default.patchArticle);
ArticleRouter.delete('/detail/:id', article_middleware_js_1.default.ValidateId, auth_middleware_js_1.checkArticleAuthorize, article_controller_js_1.default.deleteArticle);
//like feature
ArticleRouter.post('detail/:id', passport_1.default.authenticate('AccessToken', { session: false }), like_controller_js_1.default.ArticleLike);
ArticleRouter.delete('detail/:id', passport_1.default.authenticate('AccessToken', { session: false }), like_controller_js_1.default.ArticleDislike);
//article comments API routing
ArticleRouter.get('/comments', article_controller_js_1.default.getComments);
ArticleRouter.post('/detail/:id/comments', article_middleware_js_1.default.ValidateId, passport_1.default.authenticate('AccessToken', { session: false }), article_controller_js_1.default.postComment);
ArticleRouter.patch('/detail/:id/comments', article_middleware_js_1.default.ValidateId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkArticleCommentAuth, article_controller_js_1.default.patchComment);
ArticleRouter.delete('/detail/:id/comments/:commentId', article_middleware_js_1.default.ValidateId, passport_1.default.authenticate('AccessToken', { session: false }), auth_middleware_js_1.checkArticleCommentAuth, article_controller_js_1.default.deleteComment);
exports.default = ArticleRouter;
