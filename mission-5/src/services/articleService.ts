import { ForbiddenError } from '@/lib/errors.js';
import type { ArticleParams, PatchArticle, PostArticle } from '@/types/article.types.js';
import type { GetListParams } from '@/types/shared.type.js';
import type { ArticleRepository } from '@/repositories/articles.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class ArticleService {
  constructor(
    @inject(TYPES.ArticleRepository) private readonly articleRepository: ArticleRepository
  ) {}

  async authorization({ userId, articleId }: ArticleParams): Promise<boolean> {
    const article = await this.articleRepository.findOwnerById({ articleId });
    return article.userId === userId;
  }

  async getArticleList({ keyword, page, pageSize, userId }: GetListParams) {
    const articles = await this.articleRepository.findMany({ keyword, page, pageSize, userId });
    const results = articles.map((article) => {
      const { likes: _likes, _count, ...filteredArticle } = article;
      return {
        likeCount: article._count.likes,
        isLike: userId ? article.likes.length === 1 : false,
        ...filteredArticle,
      };
    });
    return results;
  }

  async postArticle({ userId, title, content }: PostArticle) {
    const article = await this.articleRepository.create({ userId, title, content });
    return article;
  }

  async getArticle({ articleId, userId }: ArticleParams) {
    const article = await this.articleRepository.findById({ articleId, userId });
    const { likes: _likes, _count, ...filteredArticle } = article;
    const result = {
      likeCount: article._count.likes,
      isLike: userId ? article.likes.length === 1 : false,
      ...filteredArticle,
    };
    return result;
  }

  async patchArticle({ articleId, userId, data }: PatchArticle) {
    if (await this.authorization({ userId, articleId })) {
      const article = await this.articleRepository.update({ articleId, data });
      return article;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteArticle({ articleId, userId }: ArticleParams) {
    if (await this.authorization({ userId, articleId })) {
      const article = await this.articleRepository.delete({ articleId });
      return article;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
  async postArticleLike({ userId, articleId }: ArticleParams) {
    const article = await this.articleRepository.like({ userId, articleId });
    return article;
  }
  async deleteArticleLike({ userId, articleId }: ArticleParams) {
    const article = await this.articleRepository.unlike({ userId, articleId });
    return article;
  }
}
