import { ArticleRepository, LikeRepository } from '../repositories/index.js';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
  ArticleWithLikeStatusDto,
  ArticleListResponseDto,
  ArticleQueryDto,
} from '../dto/index.js';

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private likeRepository: LikeRepository,
  ) {}

  async createArticle(
    articleData: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    return await this.articleRepository.create(articleData);
  }

  async getArticleById(
    id: number,
    userId?: number,
  ): Promise<ArticleWithLikeStatusDto | null> {
    const article = await this.articleRepository.findByIdWithCounts(id);
    if (!article) return null;

    const isLiked = userId
      ? await this.likeRepository.checkArticleLike(userId, id)
      : false;

    return {
      ...article,
      isLiked,
    };
  }

  async getArticles(
    query: ArticleQueryDto,
    userId?: number,
  ): Promise<ArticleListResponseDto> {
    const { articles, totalCount } =
      await this.articleRepository.findMany(query);

    if (!userId) {
      const articlesWithLikeStatus = articles.map((article) => ({
        ...article,
        isLiked: false,
      }));
      return { list: articlesWithLikeStatus, totalCount };
    }

    const articleIds = articles.map((article) => article.id);
    const likeMap = await this.likeRepository.checkMultipleArticleLikes(
      userId,
      articleIds,
    );

    const articlesWithLikeStatus = articles.map((article) => ({
      ...article,
      isLiked: likeMap[article.id] || false,
    }));

    return { list: articlesWithLikeStatus, totalCount };
  }

  async updateArticle(
    id: number,
    articleData: UpdateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDto> {
    const hasPermission = await this.articleRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 게시글을 수정할 권한이 없습니다.');
    }

    return await this.articleRepository.update(id, articleData);
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const hasPermission = await this.articleRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 게시글을 삭제할 권한이 없습니다.');
    }

    await this.articleRepository.delete(id);
  }

  async toggleLike(
    articleId: number,
    userId: number,
  ): Promise<{ isLiked: boolean }> {
    const existingLike = await this.likeRepository.findByUserAndArticle(
      userId,
      articleId,
    );

    if (existingLike) {
      await this.likeRepository.deleteByUserAndArticle(userId, articleId);
      return { isLiked: false };
    } else {
      await this.likeRepository.create({
        userId,
        articleId,
      });
      return { isLiked: true };
    }
  }
}
