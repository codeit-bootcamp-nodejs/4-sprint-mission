import createArticleComment from "./post.article.comment.create.js";
import createArticle from "./post.article.create.js";
import getArticleDetail from "./get.article.detail.js";
import getArticleList from "./get.article.list.js";
import getArticleComment from "./get.article.comments.js";
import updateArticle from "./update.article.js";
import updateArticleComment from "./update.article.comment.js";
import deleteArticle from "./delete.article.js";
import deleteArticleComment from "./delete.article.comment.js";
const articleApi = {
    createArticleComment,
    createArticle,
    getArticleDetail,
    getArticleList,
    getArticleComment,
    updateArticle,
    updateArticleComment,
    deleteArticle,
    deleteArticleComment,
};
Object.freeze(articleApi);
export default articleApi;
//# sourceMappingURL=index.js.map