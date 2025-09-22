import { ArticlesRepository } from "../repositories/articlesRepository";
import { CreateArticleDTO, UpdateArticleDTO } from "../dtos/article.dto";

const repo = new ArticlesRepository();

export class ArticlesService {
  async create(data: CreateArticleDTO) {
    return repo.create(data);
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async update(data: UpdateArticleDTO) {
    const article = await repo.findById(data.id);
    if (!article) throw new Error("게시글 없음");
    if (article.user.id !== data.userId) throw new Error("권한 없음");

    return repo.update(data);
  }

  async delete(id: number, userId: number) {
    const article = await repo.findById(id);
    if (!article) throw new Error("게시글 없음");
    if (article.user.id !== userId) throw new Error("권한 없음");

    return repo.delete(id);
  }

  async list(page: number, pageSize: number, sort: "recent" | "asc", search: string) {
    const skip = (page - 1) * pageSize;
    const { articles, total } = await repo.list(skip, pageSize, search, sort);

    return {
      data: articles,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
