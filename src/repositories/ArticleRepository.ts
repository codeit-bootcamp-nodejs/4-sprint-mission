import prisma from '../index';
import { Article as PrismaArticle, Prisma } from '@prisma/client';

class ArticleRepository {
  async findArticleById(id: number): Promise<PrismaArticle | null> {
    return prisma.article.findUnique({ where: { id } });
  }

  async findArticles(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
  }): Promise<PrismaArticle[]> {
    return prisma.article.findMany(options);
  }

  async createArticle(data: Prisma.ArticleCreateInput): Promise<PrismaArticle> {
    return prisma.article.create({ data });
  }

  async updateArticle(id: number, data: Prisma.ArticleUpdateInput): Promise<PrismaArticle> {
    return prisma.article.update({ where: { id }, data });
  }

  async deleteArticle(id: number): Promise<PrismaArticle> {
    return prisma.article.delete({ where: { id } });
  }
}

export default ArticleRepository;
