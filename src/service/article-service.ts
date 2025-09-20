import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from '../repository/article-repository';

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private prisma: PrismaClient,
  ) {}

  createArticle = async (userId: number, title: string, content: string) => {
    return await this.articleRepository.createArticle(userId, title, content);
  };

  getArticles = async (
    page: number,
    limit: number,
    search: string | undefined,
    userId: number | undefined,
  ) => {
    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};
    const offset = (page - 1) * limit;

    const [articles, totalCount] = await this.prisma.$transaction(
      async (tx) => {
        const articles = await this.articleRepository.findManyArticles(
          whereCondition,
          offset,
          limit,
          userId,
          tx,
        );
        const totalCount = await this.articleRepository.countArticles(
          whereCondition,
          tx,
        );
        return [articles, totalCount];
      },
    );

    const totalPages = Math.ceil(totalCount / limit);
    return {
      data: articles,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  getArticleById = async (articleId: string, userId: number | undefined) => {
    const article = await this.articleRepository.findArticleById(
      articleId,
      userId,
    );
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    return article;
  };

  updateArticle = async (
    userId: number,
    articleId: string,
    articleData: { title?: string; content?: string },
  ) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new Error('게시글을 수정할 권한이 없습니다.');
    }

    const { title, content } = articleData;
    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;

    return await this.articleRepository.updateArticle(
      articleId,
      dataToUpdate,
    );
  };

  deleteArticle = async (userId: number, articleId: string) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new Error('게시글을 삭제할 권한이 없습니다.');
    }
    await this.articleRepository.deleteArticle(articleId);
  };
}