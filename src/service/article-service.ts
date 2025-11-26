import { Prisma, PrismaClient, Article } from "@prisma/client";
import { ArticleRepository } from "../repository/article-repository.js";
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleListResponseDto,
  ArticleDetailResponseDto,
} from "../types/dto.js";

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private prisma: PrismaClient
  ) {}

  createArticle = async (
    userId: number,
    createArticleDto: CreateArticleDto
  ): Promise<Article> => {
    const { title, content } = createArticleDto;
    return await this.articleRepository.createArticle(userId, title, content);
  };

  getArticles = async (
    page: number,
    limit: number,
    search: string | undefined,
    userId: number | undefined
  ): Promise<ArticleListResponseDto> => {
    const whereCondition: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
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
          tx
        );
        const totalCount = await this.articleRepository.countArticles(
          whereCondition,
          tx
        );
        return [articles, totalCount];
      }
    );

    const totalPages = Math.ceil(totalCount / limit);
    return {
      data: articles,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  getArticleById = async (
    articleId: string,
    userId: number | undefined
  ): Promise<ArticleDetailResponseDto> => {
    const article = await this.articleRepository.findArticleById(
      articleId,
      userId
    );
    if (!article) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    return article;
  };

  updateArticle = async (
    userId: number,
    articleId: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    if (article.userId !== userId) {
      throw new Error("게시글을 수정할 권한이 없습니다.");
    }

    return await this.articleRepository.updateArticle(
      articleId,
      updateArticleDto
    );
  };

  deleteArticle = async (userId: number, articleId: string): Promise<void> => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    if (article.userId !== userId) {
      throw new Error("게시글을 삭제할 권한이 없습니다.");
    }
    await this.articleRepository.deleteArticle(articleId);
  };
}
