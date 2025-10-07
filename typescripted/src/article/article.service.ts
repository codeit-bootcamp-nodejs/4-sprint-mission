import prisma from "../lib/prisma";
import { IUser } from "../user/user.service";
import { IComment } from "../comment/comment.service";
import HttpError from "../lib/error";

// frame
export interface IArticle {
  id?: number;
  title?: string | null;
  content?: string | null;
  comments: IComment[];
  owner: IUser;
  ownerId : number;
}

interface InputArticle {
  take: number;
  skip: number;
  keyword: "content" | "title";
}
interface InputCreateArticle {
  ownerId?: number;
  title: string |null;
  content: string | null;
}
// respone
interface OutputArticleList {
  title?: string | null;
  content?: string | null;
}

type ArticleWithOwnerIdOnly = Omit<IArticle, "owner"> & {
  owner: { id: number };
};

interface OutputCreateArticle {
  ownerId?: number;
  title: string | null;
  content: string | null;
}

export class ArticleService {
  async getArticleList({
    take,
    skip,
    keyword,
  }: InputArticle): Promise<OutputArticleList[]> {
    const whereCondition = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {};
    const Articles = await prisma.article.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: { title: true, content: true }, // 필요한 필드만
    });
    return Articles;
  }
  async getArticle(input: {
    articleId: number;
  }): Promise<ArticleWithOwnerIdOnly> {
    const { articleId } = input;
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        comments: true,
        owner: { select: { id: true } },
      },
    });
    if (!article) throw new HttpError(404, "Article not found");
    return article;
  }
  async createArticle({
    title,
    content,
    ownerId,
  }: InputCreateArticle): Promise<OutputCreateArticle> {
    const result = await prisma.article.create({
      data: {
        title,
        content,
        owner: { connect: { id: ownerId } },
      },
      include: {
        owner: { select: { id: true } },
      },
    });
    return result
  }
  async pacthArticle({articleId, title, content} : any): Promise<Pick< IArticle, "title"|"content" | "id" >>{
    const isValid = await this.getArticle({articleId})
    if (!isValid) throw new HttpError(404, "Article not found");

    const result = await prisma.article.update({
      where:{
        id: articleId
      },
      data:{
        title,
        content
      }
    })
    return result
  }
  async poppedArticle({articleId} :any): Promise<void> {
    const isValid = await this.getArticle({articleId}) 
    if (!isValid) throw new HttpError(404, "Article not found");
    await prisma.article.delete({
      where:{
        id:articleId
      }
    })
  }
}
