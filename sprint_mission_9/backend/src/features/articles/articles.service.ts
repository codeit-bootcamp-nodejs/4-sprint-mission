import { ArticlesRepository } from './articles.repository';
import { ArticleFilter, PaginationParams, PaginatedResponse } from '../../shared/types/models';
import { CreateArticleInput, UpdateArticleInput, GetArticlesQuery } from './articles.dto';

export class ArticlesService {
  constructor(private repository: ArticlesRepository) {}

  async getArticles(query: GetArticlesQuery) {
    const filter: ArticleFilter & PaginationParams = {
      page: query.page,
      limit: query.limit,
      orderBy: query.orderBy,
      sortOrder: query.sortOrder,
      userId: query.userId,
      search: query.search,
    };

    const result = await this.repository.findMany(filter);

    return {
      ...result,
      data: result.data.map((article) => ({
        ...article,
        likeCount: article._count.likes,
        commentCount: article._count.comments,
      })),
    };
  }

  async getArticleById(id: number) {
    const article = await this.repository.findById(id);
    if (!article) {
      throw new Error('Article not found');
    }

    return {
      ...article,
      likeCount: article._count.likes,
      commentCount: article._count.comments,
    };
  }

  async createArticle(data: CreateArticleInput) {
    const article = await this.repository.create(data);
    return {
      ...article,
      likeCount: article._count.likes,
      commentCount: article._count.comments,
    };
  }

  async updateArticle(id: number, data: UpdateArticleInput, userId: number) {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 게시글을 수정할 권한이 없습니다.');
    }

    const article = await this.repository.update(id, data);
    return {
      ...article,
      likeCount: article._count.likes,
      commentCount: article._count.comments,
    };
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 게시글을 삭제할 권한이 없습니다.');
    }

    await this.repository.delete(id);
  }

  async toggleLike(articleId: number, userId: number): Promise<{ liked: boolean }> {
    const isLiked = await this.repository.checkLike(userId, articleId);

    if (isLiked) {
      await this.repository.removeLike(userId, articleId);
      return { liked: false };
    } else {
      await this.repository.addLike(userId, articleId);
      return { liked: true };
    }
  }
}
