import type {
  ArticleQueryDTO,
  ArticleDTO,
  PatchArticleDTO,
} from "../dto/article.dto.js";
import prisma from "../lib/prisma.js";
import { Helper } from "../helper/helper.js";


const helper = new Helper()
export class ArticleService {
  
  async accessArticleList(query: ArticleQueryDTO) {
    const { page, take, title, content, keyword } = query;
    const skip = (page - 1) * take;
    const whereCondition = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {};
    const articles = await prisma.article.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    const result = articles.map((a) => ({
      title: a.title,
      content: a.content,
    }));
    return result;
  }

  async accessArticle(id: number): Promise<ArticleDTO> {
    const article = await helper.findArticleById(id);

    if (!article) throw new Error("해당 게시글이 존재하지 않습니다");
    const result: ArticleDTO = {
      id: article.id,
      title: article.title ?? "",
      content: article.content,
      createdAt: article.createdAt,
      ownerId: article.ownerId,
      comments: article.comments,
    };
    return result;
  }

  async createArticle(
    userId: number,
    elements: ArticleDTO
  ): Promise<ArticleDTO> {
    const { title, content, ownerId, comments } = elements;

    const result = await prisma.article.create({
      data: {
        title: title ?? "",
        content: content ?? "",
        ownerId: userId,
        comments:
          comments && comments.length > 0
            ? {
                create: comments.map((c) => ({
                  content: c.content,
                  userId: c.userId,
                })),
              }
            : {},
      },
      include: {
        comments: true,
      },
    });
    return result;
  }

  async modifyArticle(
    articleId: number,
    userId: number,
    element: PatchArticleDTO
  ) {
    const { title, content, ownerId } = element;
    const article = await helper.findArticleById(articleId);
    if (!article) throw new Error("해당 게시글이 존재하지 않습니다");

    const result = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: title ?? "",
        content: content ?? "",
        ownerId: userId,
      },
    });
    return result;
  }

  async deleteArticle(articleId: number, userId: number) {
    const article = await helper.findArticleById(articleId);
    if (!article) throw new Error("해당 게시글이 존재 하지 않습니다");
    const result = await prisma.article.delete({
      where: { id: articleId },
    });
    return result
  }
}
