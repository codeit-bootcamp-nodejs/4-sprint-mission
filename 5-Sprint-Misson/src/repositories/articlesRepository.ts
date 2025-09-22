import { PrismaClient, Prisma } from "@prisma/client";
import { CreateArticleDTO, UpdateArticleDTO } from "../dtos/article.dto";

const prisma = new PrismaClient();

export class ArticlesRepository {
  async create(data: CreateArticleDTO) {
    return prisma.article.create({ data });
  }

  async findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true } }
      }
    });
  }

  async update(data: UpdateArticleDTO) {
    return prisma.article.update({
      where: { id: data.id },
      data: { title: data.title, content: data.content }
    });
  }

  async delete(id: number) {
    return prisma.article.delete({ where: { id } });
  }

  async list(skip: number, take: number, search: string, sort: "recent" | "asc") {
    const where: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } }
          ]
        }
      : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: sort === "recent" ? "desc" : "asc" },
      skip,
      take,
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: { select: { id: true, email: true } }
      }
    });

    const total = await prisma.article.count({ where });
    return { articles, total };
  }
}
