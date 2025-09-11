import type { CreateArticleData, UpdateArticleData, FindManyArticleParams } from "../types/article.js";
import type { CustomError } from "../types/error.js";
import * as ArticleRepository from "../repositories/ArticleRepository.js";

const ArticleService = {
  async createArticle(articleData: CreateArticleData, userId: number) {
    const newArticle = await ArticleRepository.create({
      ...articleData,
      user: { connect: { id: userId } },
    });
    return newArticle;
  },

  async findUniqueArticle(articleId: number, userId?: number) {
    const article = await ArticleRepository.findById(articleId);

    if (!article) {
      throw new Error("존재하지 않는 게시글입니다.");
    }

    if (!userId) {
      return { ...article, isLiked: false };
    }

    // 좋아요 정보 조회
    const like = await ArticleRepository.findLikeByUserAndArticle(userId, articleId);

    return { ...article, isLiked: !!like };
  },

  async updateArticle(id: number, updateData: UpdateArticleData, userId: number) {
    const article = await ArticleRepository.findById(id);

    if (!article) {
      const error: CustomError = new Error("존재하지 않는 게시글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: CustomError = new Error("게시글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await ArticleRepository.update(id, updateData);
  },

  async deleteArticle(id: number, userId: number) {
    const article = await ArticleRepository.findById(id);

    if (!article) {
      const error: CustomError = new Error("존재하지 않는 게시글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: CustomError = new Error("게시글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    await ArticleRepository.remove(id);
  },

  async findManyArticle(params: FindManyArticleParams) {
    const articles = await ArticleRepository.findMany(params);
    return articles;
  },
};

export default ArticleService;
