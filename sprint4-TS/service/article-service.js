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
exports.ArticleService = void 0;
var prisma_js_1 = require("../lib/prisma.js");
var ArticleService = /** @class */ (function () {
    function ArticleService() {
        var _this = this;
        this.getArticles = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var orderBy, Articles;
            var skip = _b.skip, take = _b.take, sort = _b.sort, searchtitle = _b.searchtitle, searchcontent = _b.searchcontent;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        skip = Number(skip);
                        take = Number(take);
                        if (sort == 'oldest') {
                            orderBy = { createdAt: 'desc' };
                        }
                        else if (sort == 'recent') {
                            orderBy = { createdAt: 'asc' };
                        }
                        else {
                            orderBy = { createdAt: 'desc' };
                        }
                        return [4 /*yield*/, prisma_js_1.default.article.findMany({
                                skip: skip,
                                take: take,
                                orderBy: orderBy,
                                where: {
                                    AND: [{ title: { contains: searchtitle,
                                                mode: 'insensitive' } },
                                        { articleContent: { contains: searchcontent } }]
                                }
                            })];
                    case 1:
                        Articles = _c.sent();
                        return [2 /*return*/, Articles];
                }
            });
        }); };
        this.getComment = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var articleComment;
            var take = _b.take, skip = _b.skip, commentId = _b.commentId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        take = Number(take);
                        skip = Number(skip);
                        commentId = Number(commentId);
                        return [4 /*yield*/, prisma_js_1.default.articleComment.findMany({
                                take: take,
                                skip: skip,
                                cursor: { id: commentId },
                                orderBy: { id: 'asc' }
                            })];
                    case 1:
                        articleComment = _c.sent();
                        return [2 /*return*/, articleComment];
                }
            });
        }); };
        this.addIsLiked = function (user, article) { return __awaiter(_this, void 0, void 0, function () {
            var articleLikeList, likedArticleIds, _i, articleLikeList_1, articleLike, articleId_1, articleId;
            return __generator(this, function (_a) {
                articleLikeList = user.articleLike;
                likedArticleIds = [];
                if (!articleLikeList) {
                    article.isLiked = false;
                }
                else {
                    for (_i = 0, articleLikeList_1 = articleLikeList; _i < articleLikeList_1.length; _i++) {
                        articleLike = articleLikeList_1[_i];
                        articleId_1 = articleLike.articleId;
                        likedArticles.push(article);
                    }
                    articleId = Number(article.id);
                    if (likedArticleIds.includes(articleId)) {
                        article.isLiked = true;
                    }
                    else {
                        article.isLiked = false;
                    }
                }
                return [2 /*return*/, article];
            });
        }); };
    }
    return ArticleService;
}());
exports.ArticleService = ArticleService;
exports.default = new ArticleService();
