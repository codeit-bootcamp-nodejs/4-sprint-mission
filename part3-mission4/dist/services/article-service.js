import { Prisma } from '@prisma/client';
import { articleRepository } from '../repositories/article-repository.js';
import { articleLikeRepository, commentLikeRepository, } from '../repositories/like-repository.js';
import AppError from '../lib/appError.js';
class ArticleService {
    // 전체 게시글 조회
    async getAllArticles(query, userId) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = query.sort || 'recent';
        const search = query.keyword || '';
        const orderBy = sort === 'old' ? { createdAt: 'asc' } : { createdAt: 'desc' };
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const articles = await articleRepository.findMany({
            skip,
            take: limit,
            where,
            orderBy,
            include: {
                user: { select: { username: true } },
                comments: {
                    include: { user: { select: { username: true } } },
                },
            },
        });
        const articlesWithLike = await Promise.all(articles.map(async (a) => {
            const likeCount = await articleLikeRepository.count(a.id);
            const commentsWithLikes = await Promise.all(a.comments.map(async (c) => {
                const cLikeCount = await commentLikeRepository.count(c.id);
                // userId가 있으면 exists 체크, 없으면 false
                const cIsLiked = userId
                    ? await commentLikeRepository.exists(userId, c.id)
                    : false;
                return {
                    ...c,
                    likeCount: cLikeCount,
                    isLiked: cIsLiked,
                };
            }));
            const isLiked = userId
                ? await articleLikeRepository.exists(userId, a.id)
                : false;
            return {
                ...a,
                likeCount,
                isLiked,
                comments: commentsWithLikes,
            };
        }));
        const totalArticles = await articleRepository.count(where);
        const totalPages = Math.ceil(totalArticles / limit);
        return {
            data: articlesWithLike,
            pagination: { totalArticles, totalPages, currentPage: page, limit },
        };
    }
    // 단일 게시글 조회
    async getArticleById(articleId, userId) {
        const article = await articleRepository.findUnique(articleId);
        if (!article)
            throw new AppError('존재하지 않는 게시글입니다.', 404);
        const likeCount = await articleLikeRepository.count(article.id);
        const isLiked = userId
            ? await articleLikeRepository.exists(userId, article.id)
            : false;
        const commentsWithLikes = await Promise.all(article.comments.map(async (c) => {
            const cLikeCount = await commentLikeRepository.count(c.id);
            const cIsLiked = userId
                ? await commentLikeRepository.exists(userId, c.id)
                : false;
            return {
                ...c,
                likeCount: cLikeCount,
                isLiked: cIsLiked,
            };
        }));
        return {
            ...article,
            likeCount,
            isLiked,
            comments: commentsWithLikes,
        };
    }
    // 게시글 작성
    async createArticle(title, content, userId) {
        if (!userId)
            throw new AppError('작성자를 확인할 수 없습니다.', 400);
        const newArticle = await articleRepository.create({
            title,
            content,
            userId,
        });
        if (!newArticle)
            throw new AppError('게시글 등록에 실패했습니다.', 400);
        return newArticle;
    }
    // 게시글 수정
    async updateArticle(articleId, userId, updateData) {
        const product = await articleRepository.findUnique(articleId);
        if (!product)
            throw new AppError('제품 없음', 404);
        if (product.userId !== userId)
            throw new AppError('권한 없음', 403);
        await articleRepository.update(articleId, userId, updateData);
        return { message: '게시글이 수정되었습니다.' };
    }
    // 게시글 삭제
    async deleteArticle(articleId, userId) {
        const deleted = await articleRepository.delete(articleId, userId);
        if (deleted.count === 0) {
            throw new AppError('권한이 없거나 게시글이 존재하지 않습니다.', 403);
        }
        return { message: '게시글이 삭제되었습니다.' };
    }
    // 본인이 작성한 게시글 조회
    async getUserArticles(userId) {
        return articleRepository.findUserArticles(userId);
    }
    // 좋아요한 게시글 조회
    async getUserLikedArticles(userId) {
        return articleRepository.findLikedArticles(userId);
    }
    // 게시글 좋아요
    async articleLike(userId, articleId) {
        const alreadyLiked = await articleLikeRepository.exists(userId, articleId);
        if (alreadyLiked) {
            throw new AppError('이미 좋아요를 눌렀습니다.', 400);
        }
        await articleLikeRepository.create(userId, articleId);
        const count = await articleLikeRepository.count(articleId);
        return { message: '좋아요 완료', likeCount: count };
    }
    // 게시글 좋아요 취소
    async articleUnlike(userId, articleId) {
        const exists = await articleLikeRepository.exists(userId, articleId);
        if (!exists) {
            throw new AppError('좋아요를 누른 기록이 없습니다.', 400);
        }
        await articleLikeRepository.delete(userId, articleId);
        const count = await articleLikeRepository.count(articleId);
        return { message: '좋아요 취소', likeCount: count };
    }
}
export const articleService = new ArticleService();
//# sourceMappingURL=article-service.js.map