"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentService_1 = __importDefault(require("../CommentService"));
const LikeService_1 = __importDefault(require("../LikeService"));
const CommentRepository_1 = __importDefault(require("../repositories/CommentRepository"));
const LikeRepository_1 = __importDefault(require("../repositories/LikeRepository"));
class ArticlesController {
    constructor(articleService) {
        this.createArticle = async (req, res, next) => {
            try {
                const { title, content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const article = await this.articleService.createArticle({
                    title,
                    content,
                    userId: user.id,
                });
                res.status(201).json(article);
            }
            catch (error) {
                next(error);
            }
        };
        this.getArticles = async (req, res, next) => {
            try {
                const { sort, search } = req.query;
                let page = parseInt(req.query.page) || 1;
                let limit = parseInt(req.query.limit) || 10;
                let offset = (page - 1) * limit;
                const where = search
                    ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { content: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {};
                const user = req.user;
                const articles = await this.articleService.getArticles({
                    where,
                    orderBy: sort === 'recent' ? { createdAt: 'desc' } : undefined,
                    skip: offset,
                    take: limit,
                });
                let responseArticles = articles;
                if (user) {
                    const articleIds = articles.map(article => article.id);
                    const likes = await this.likeService.findLikes({
                        where: {
                            userId: user.id,
                            articleId: { in: articleIds },
                        },
                    });
                    const likedArticleIds = new Set(likes.map((like) => like.articleId));
                    responseArticles = articles.map(article => ({
                        ...article,
                        isLiked: likedArticleIds.has(article.id),
                    }));
                }
                else {
                    responseArticles = articles.map(article => ({
                        ...article,
                        isLiked: false,
                    }));
                }
                res.status(200).json(responseArticles);
            }
            catch (error) {
                next(error);
            }
        };
        this.getArticleById = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const user = req.user;
                const article = await this.articleService.getArticleById(parseInt(articleId));
                if (!article) {
                    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
                }
                let isLiked = false;
                if (user) {
                    const like = await this.likeService.findLikeByUserIdAndArticleId(user.id, parseInt(articleId));
                    if (like) {
                        isLiked = true;
                    }
                }
                const responseArticle = { ...article, isLiked };
                res.status(200).json(responseArticle);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateArticle = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const { title, content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const article = await this.articleService.getArticleById(parseInt(articleId));
                if (!article || article.userId !== user.id) {
                    return res.status(403).json({ message: '게시글 수정 권한이 없습니다.' });
                }
                const updatedArticle = await this.articleService.updateArticle(parseInt(articleId), {
                    title,
                    content,
                });
                res.status(200).json(updatedArticle);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteArticle = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const article = await this.articleService.getArticleById(parseInt(articleId));
                if (!article || article.userId !== user.id) {
                    return res.status(403).json({ message: '게시글 삭제 권한이 없습니다.' });
                }
                await this.articleService.deleteArticle(parseInt(articleId));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.createComment = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const { content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                if (!content)
                    return res.status(400).json({ message: '댓글을 입력해주세요.' });
                const newComment = await this.commentService.createComment({
                    content,
                    articleId: parseInt(articleId),
                    userId: user.id,
                });
                res.status(201).json(newComment);
            }
            catch (error) {
                next(error);
            }
        };
        this.getComments = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                let cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
                let limit = parseInt(req.query.limit) || 10;
                const comments = await this.commentService.getComments({
                    where: { articleId: parseInt(articleId) },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: cursor ? 1 : 0,
                });
                res.status(200).json(comments);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const { content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                if (!content)
                    return res.status(400).json({ message: '수정할 내용을 입력하세요.' });
                const comment = await this.commentService.getCommentById(parseInt(commentId));
                if (!comment || comment.userId !== user.id) {
                    return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
                }
                const updatedComment = await this.commentService.updateComment(parseInt(commentId), {
                    content,
                });
                res.status(200).json(updatedComment);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const comment = await this.commentService.getCommentById(parseInt(commentId));
                if (!comment || comment.userId !== user.id) {
                    return res.status(403).json({ message: '댓글 삭제 권환이 없습니다.' });
                }
                await this.commentService.deleteComment(parseInt(commentId));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleLike = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const article = await this.articleService.getArticleById(parseInt(articleId));
                if (!article) {
                    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
                }
                const existingLike = await this.likeService.findLikeByUserIdAndArticleId(user.id, parseInt(articleId));
                if (existingLike) {
                    await this.likeService.deleteLike(existingLike.id);
                    res.status(200).json({ message: '게시글 좋아요를 취소했습니다.' });
                }
                else {
                    await this.likeService.createLike({
                        userId: user.id,
                        articleId: parseInt(articleId),
                    });
                    res.status(201).json({ message: '게시글에 좋아요를 눌렀습니다.' });
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.articleService = articleService;
        const commentRepository = new CommentRepository_1.default();
        this.commentService = new CommentService_1.default(commentRepository);
        const likeRepository = new LikeRepository_1.default();
        this.likeService = new LikeService_1.default(likeRepository);
    }
}
exports.default = ArticlesController;
