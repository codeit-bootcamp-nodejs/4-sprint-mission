"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_article_comment_create_js_1 = __importDefault(require("./post.article.comment.create.js"));
const post_article_create_js_1 = __importDefault(require("./post.article.create.js"));
const get_article_detail_js_1 = __importDefault(require("./get.article.detail.js"));
const get_article_list_js_1 = __importDefault(require("./get.article.list.js"));
const get_article_comments_js_1 = __importDefault(require("./get.article.comments.js"));
const update_article_js_1 = __importDefault(require("./update.article.js"));
const update_article_comment_js_1 = __importDefault(require("./update.article.comment.js"));
const delete_article_js_1 = __importDefault(require("./delete.article.js"));
const delete_article_comment_js_1 = __importDefault(require("./delete.article.comment.js"));
const articleApi = {
    createArticleComment: post_article_comment_create_js_1.default,
    createArticle: post_article_create_js_1.default,
    getArticleDetail: get_article_detail_js_1.default,
    getArticleList: get_article_list_js_1.default,
    getArticleComment: get_article_comments_js_1.default,
    updateArticle: update_article_js_1.default,
    updateArticleComment: update_article_comment_js_1.default,
    deleteArticle: delete_article_js_1.default,
    deleteArticleComment: delete_article_comment_js_1.default,
};
Object.freeze(articleApi);
exports.default = articleApi;
//# sourceMappingURL=index.js.map