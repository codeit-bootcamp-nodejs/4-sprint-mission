import { Prisma, PrismaClient } from '@prisma/client';

export class ArticleRepository {
  constructor(private prisma: PrismaClient) {}

  createArticle = async (userId: number, title: string, content: string) => {
    return await this.prisma.article.create({
      data: { userId, title, content },
    });
  };

  findManyArticles = async (
    whereCondition: Prisma.ArticleWhereInput,
    offset: number,
    limit: number,
    userId: number | undefined,
    tx?: Prisma.TransactionClient,
  ) => {
    const prismaClient = tx || this.prisma;
    const articles = await prismaClient.article.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    if (userId && articles.length > 0) {
      const articleIds = articles.map((a) => a.id);
      const likes = await this.prisma.articleLike.findMany({
        where: { userId, articleId: { in: articleIds } },
        select: { articleId: true },
      });
      const likedArticleIds = new Set(likes.map((like) => like.articleId));
      return articles.map((article) => ({
        ...article,
        isLiked: likedArticleIds.has(article.id),
      }));
    }

    return articles.map((article) => ({ ...article, isLiked: false }));
  };

  countArticles = async (
    whereCondition: Prisma.ArticleWhereInput,
    tx?: Prisma.TransactionClient,
  ) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.article.count({ where: whereCondition });
  };

  findArticleById = async (
    articleId: string,
    userId?: number | undefined,
  ) => {
    const article = await this.prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        _count: { select: { likes: true } },
      },
    });

    if (article && userId) {
      const like = await this.prisma.articleLike.findUnique({
        where: {
          userId_articleId: { userId, articleId: parseInt(articleId) },
        },
      });
      return { ...article, isLiked: !!like };
    }

    if (article) {
      return { ...article, isLiked: false };
    }

    return null;
  };

  updateArticle = async (
    articleId: string,
    dataToUpdate: Prisma.ArticleUpdateInput,
  ) => {
    return await this.prisma.article.update({
      where: { id: parseInt(articleId) },
      data: dataToUpdate,
    });
  };

  deleteArticle = async (articleId: string) => {
    await this.prisma.article.delete({
      where: { id: parseInt(articleId) },
    });
  };
}