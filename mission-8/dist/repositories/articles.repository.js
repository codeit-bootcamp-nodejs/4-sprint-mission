import { prisma } from '../utils/prisma.util.js';
export class ArticlesRepository {
    constructor() {
        this.createArticle = async (data) => {
            return await prisma.article.create({ data });
        };
        this.findArticles = async () => {
            return await prisma.article.findMany({
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            nickname: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        };
        this.findArticleById = async (articleId) => {
            return await prisma.article.findUnique({
                where: { id: articleId },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        };
        this.findArticleByIdSimple = async (articleId) => {
            return await prisma.article.findUnique({ where: { id: articleId } });
        };
        this.updateArticle = async (articleId, data) => {
            return await prisma.article.update({
                where: { id: articleId },
                data,
            });
        };
        this.deleteArticle = async (articleId) => {
            return await prisma.article.delete({ where: { id: articleId } });
        };
        this.findArticleLike = async (userId, articleId) => {
            return await prisma.articleLike.findUnique({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            });
        };
        this.createArticleLike = async (userId, articleId) => {
            return await prisma.articleLike.create({
                data: {
                    userId,
                    articleId,
                },
            });
        };
        this.deleteArticleLike = async (userId, articleId) => {
            return await prisma.articleLike.delete({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            });
        };
    }
}
