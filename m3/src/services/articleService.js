import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const articleService = {
    
    async getAllArticles(queryParams = {}) {
        const {
            offset = 0,
            limit = 5,
            order = "asc",
            search = "",
        } = queryParams;

        let orderBy;
        switch (order) {
            case "recent":
                orderBy = { createdAt: "desc" };
                break;
            case "asc":
            default:
                orderBy = { createdAt: "asc" };
                break;
        }

        const whereClause = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                ],
              }
            : {};

        const articles = await prisma.article.findMany({
            where: whereClause,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });

        return articles;
    },

    async createArticle(articleData) {
        const article = await prisma.article.create({
            data: articleData,
        });

        return article;
    },

    async getArticleById(articleId) {
        const article = await prisma.article.findUniqueOrThrow({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });

        return article;
    },

    async updateArticle(articleId, updateData) {
        const article = await prisma.article.update({
            where: { id: articleId },
            data: updateData,
        });

        return article;
    },

    async deleteArticle(articleId) {
        await prisma.article.delete({
            where: { id: articleId },
        });
    },

    async getArticleComments(articleId, queryParams = {}) {
        const { cursor, limit = 5 } = queryParams;
        const queryOptions = {
            where: { articleId },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            take: parseInt(limit),
            ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
        };

        const comments = await prisma.comment.findMany(queryOptions);

        const nextCursor =
            comments.length === parseInt(limit)
                ? comments[comments.length - 1].id
                : null;

        return { comments, nextCursor };
    },

    async createCommentForArticle(articleId, commentData) {
        const { content } = commentData;

        // 게시글 존재 여부 확인
        await prisma.article.findUniqueOrThrow({
            where: { id: articleId },
        });

        const comment = await prisma.comment.create({
            data: {
                articleId,
                content,
            },
        });

        return comment;
    },
};
