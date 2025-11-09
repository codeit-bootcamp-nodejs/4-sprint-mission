import { ArticleRepository } from "../repositories/articleRepository";
import type { ArticleCreateDTO, ArticleUpdateDTO, ArticleQueryDTO } from "../dtos/article.dto";
import type { Prisma } from "@prisma/client";

export class ArticleService {
  private repo = new ArticleRepository();

  async create(userId: number, data: ArticleCreateDTO) {
    return this.repo.createArticle({ ...data, userId });
  }

  async list({ page, pageSize, keyword }: ArticleQueryDTO) {
    const where: Prisma.ArticleWhereInput = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    return this.repo.findMany(where, (page - 1) * pageSize, pageSize);
  }

  async getDetail(id: number) {
    return this.repo.findById(id);
  }

  async update(userId: number, data: ArticleUpdateDTO, articleId: number) {
    const article = await this.repo.findById(articleId);
    if (!article) throw new Error("NOT_FOUND");
    if (article.userId !== userId) throw new Error("FORBIDDEN");

    return this.repo.updatedArticle(articleId, data);
  }

  async delete(userId: number, articleId: number) {
    const article = await this.repo.findById(articleId);
    if (!article) throw new Error("NOT_FOUND");
    if (article.userId !== userId) throw new Error("FORBIDDEN");

    await this.repo.deleteArticle(articleId);
  }
}

export default new ArticleService();