import { articleRepository } from "../repositories/articleRepository.js";
import type { Article, ArticleWithLike } from "../types/dto.js";

export const articleService = {
  getArticles: async (
    offset: number,
    limit: number,
    title: string | undefined,
    content: string | undefined,
    userId: number | null
  ): Promise<ArticleWithLike[]> => {
    try {
      const articles = await articleRepository.getArticles(
        offset,
        limit,
        title,
        content
      );
      if (articles.length === 0) {
        const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (!userId) {
        return articles.map((article) => ({ ...article, isLiked: false }));
      }

      const likedArticles = await articleRepository.findLikedArticles(
        userId,
        articles.map((article) => article.id)
      );

      const likedArticleIds = new Set(
        likedArticles.map((like) => like.articleId)
      );

      return articles.map((article) => ({
        ...article,
        isLiked: likedArticleIds.has(article.id),
      }));
    } catch (err) {
      throw err;
    }
  },

  createArticle: async (title: string, content: string, userId: number) => {
    try {
      return await articleRepository.createArticle(title, content, userId);
    } catch (err) {
      throw err;
    }
  },

  getArticleById: async (
    id: number,
    userId: number | null
  ): Promise<ArticleWithLike> => {
    try {
      const article = await articleRepository.getArticleById(id);

      if (!article) {
        const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      let isLiked = false;
      if (userId) {
        const like = await articleRepository.findLikedArticles(userId, [id]);
        isLiked = like.length > 0;
      }

      return { ...article, isLiked };
    } catch (err) {
      throw err;
    }
  },

  updateArticle: async (
    id: number,
    title: string | undefined,
    content: string | undefined,
    userId: number
  ): Promise<Article> => {
    try {
      const article = await articleRepository.getArticleById(id);

      if (!article) {
        const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (article.userId !== userId) {
        const error: HttpError = new Error("게시글을 수정할 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      return await articleRepository.updateArticle(id, title, content);
    } catch (err) {
      throw err;
    }
  },

  deleteArticle: async (id: number, userId: number) => {
    try {
      const article = await articleRepository.getArticleById(id);

      if (!article) {
        const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (article.userId !== userId) {
        const error: HttpError = new Error("게시글을 삭제할 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      await articleRepository.deleteArticle(id);
    } catch (err) {
      throw err;
    }
  },
};
