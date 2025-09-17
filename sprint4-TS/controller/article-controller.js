"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
var prisma_1 = require("../lib/prisma");
var article_service_1 = require("../service/article-service");
var ArticleController = /** @class */ (function () {
    function ArticleController() {
        var _this = this;
        this.getArticles = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, sort, _c, skip, _d, take, searchtitle, searchcontent, data, user, articles, _i, articles_1, article, error_1, err;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = req.query, _b = _a.sort, sort = _b === void 0 ? 'recent' : _b, _c = _a.skip, skip = _c === void 0 ? 0 : _c, _d = _a.take, take = _d === void 0 ? 30 : _d, searchtitle = _a.searchtitle, searchcontent = _a.searchcontent;
                        skip = Number(skip);
                        take = Number(take);
                        data = { sort: sort, skip: skip, take: take, searchtitle: searchtitle, searchcontent: searchcontent };
                        user = req.user;
                        console.log(user);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, article_service_1.default.getArticles(data)];
                    case 2:
                        articles = _e.sent();
                        for (_i = 0, articles_1 = articles; _i < articles_1.length; _i++) {
                            article = articles_1[_i];
                            article_service_1.default.addIsLiked(user, article);
                        }
                        res.status(200).send(articles);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        console.error(error_1);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getOneArticle = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, user, article, error_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        id = Number(id);
                        user = req.user;
                        console.log(user);
                        return [4 /*yield*/, prisma_1.default.article.findUnique({
                                where: { id: id },
                                include: { comment: true }
                            })];
                    case 1:
                        article = _a.sent();
                        return [4 /*yield*/, article_service_1.default.addIsLiked(user, article)];
                    case 2:
                        article = _a.sent();
                        return [2 /*return*/, res.status(200).send(article)];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.postArticle = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, title, articleContent, user, err, Article, error_3, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, title = _a.title, articleContent = _a.articleContent;
                        user = req.user;
                        if (!user) {
                            err = new Error("login first");
                            // err.status = 500;
                            return [2 /*return*/, next(err)];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.article.create({
                                data: { title: title, articleContent: articleContent, userId: user.id }
                            })];
                    case 2:
                        Article = _b.sent();
                        console.log("post Article success");
                        return [2 /*return*/, res.status(201).send(Article)];
                    case 3:
                        error_3 = _b.sent();
                        console.log("post Article failed because of server");
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.patchArticle = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, _a, title, articleContent, Article, error_4, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = Number(req.params.id);
                        _a = req.body, title = _a.title, articleContent = _a.articleContent;
                        return [4 /*yield*/, prisma_1.default.article.update({
                                where: { id: id },
                                data: { title: title, articleContent: articleContent }
                            })];
                    case 1:
                        Article = _b.sent();
                        console.log("patch Article success");
                        return [2 /*return*/, res.status(200).send(Article)];
                    case 2:
                        error_4 = _b.sent();
                        console.log("patch Article failed because of server");
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.deleteArticle = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, error_5, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = Number(req.params.id);
                        return [4 /*yield*/, prisma_1.default.article.delete({
                                where: { id: id }
                            })];
                    case 1:
                        _a.sent();
                        console.log("deleting article success");
                        return [2 /*return*/, res.status(204).send("deleting completed")];
                    case 2:
                        error_5 = _a.sent();
                        console.log("delete Article failed because of server");
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getComments = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, take, _c, skip, _d, commentId, data, articleComment, error_6, err;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.take, take = _b === void 0 ? 10 : _b, _c = _a.skip, skip = _c === void 0 ? 1 : _c, _d = _a.commentId, commentId = _d === void 0 ? 1 : _d;
                        take = Number(take);
                        skip = Number(skip);
                        commentId = Number(skip);
                        data = { take: take, skip: skip, commentId: commentId };
                        return [4 /*yield*/, article_service_1.default.getComment(data)];
                    case 1:
                        articleComment = _e.sent();
                        return [2 /*return*/, res.status(200).send(articleComment)];
                    case 2:
                        error_6 = _e.sent();
                        console.error(error_6);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.postComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, user, commentContent, newComment, error_7, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        user = req.user;
                        commentContent = req.body.commentContent;
                        if (!commentContent || commentContent.length > 500) {
                            next(new Error("invalid body"));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma_1.default.articleComment.create({
                                data: {
                                    commentContent: commentContent,
                                    article: {
                                        connect: { id: id }
                                    },
                                    user: {
                                        connect: {
                                            id: user.id
                                        }
                                    }
                                },
                            })];
                    case 2:
                        newComment = _a.sent();
                        return [2 /*return*/, res.status(201).send(newComment)];
                    case 3:
                        error_7 = _a.sent();
                        console.error(error_7);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.patchComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, CommentId, commentContent, err, newComment, error_8, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        CommentId = Number(req.body.id);
                        commentContent = req.body.commentContent;
                        if (!commentContent) {
                            err = new Error("invalid body data");
                            // err.status = 400;
                            return [2 /*return*/, next(err)];
                        }
                        return [4 /*yield*/, prisma_1.default.articleComment.update({
                                where: { id: CommentId },
                                data: { commentContent: commentContent }
                            })];
                    case 2:
                        newComment = _a.sent();
                        return [2 /*return*/, res.status(200).send(newComment)];
                    case 3:
                        error_8 = _a.sent();
                        console.error(error_8);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteComment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var CommentId, error_9, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        CommentId = Number(req.params.commentId);
                        return [4 /*yield*/, prisma_1.default.articleComment.delete({
                                where: { id: CommentId }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send("deleting success")];
                    case 2:
                        error_9 = _a.sent();
                        console.error(error_9);
                        err = new Error("Server Error");
                        // err.status = 500;
                        return [2 /*return*/, next(err)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    return ArticleController;
}());
exports.ArticleController = ArticleController;
exports.default = new ArticleController();
