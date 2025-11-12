import { IProduct } from "../product/product.service";
import { IUser } from "../user/user.service";
import prisma from "../lib/prisma";
import { IArticle } from "../article/article.service";
import HttpError from "../lib/error";
export interface IComment {
  id?: number;
  title: string | null;
  content: string | null;
  name?: string | null;
  user?: IUser;
  product?: IProduct;
  article?: IArticle;
}

interface OutputGetComments {
  id?: number;
  title: string | null;
  name?: string | null;
  content: string | null;
  productId?: number;
  articleId?: number;
}
interface OutputCreateComment {
  title: string | null;
  name?: string | null;
  content: string | null;
  productId?: number;
  articleId?: number;
}
export class CommentService {
  async getCommentList(input: {
    skip: number;
    take: number;
    type: string;
    id: number;
  }): Promise<OutputGetComments[]> {
    const { skip, take, type } = input;
    const commentId = Number(input.id);
    // 만약애 타입이 중고 시장 -> 중고시장 댓글들만 보이기

    const whereCondition =
      type === "MARKET" ? { productId: commentId } : { articleId: commentId };
    const includeField =
      type === "MARKET" ? { product: true } : { article: true };
    const commentList = await prisma.comment.findMany({
      where: whereCondition,
      include: includeField,
      take,
      skip,
    });
    return commentList;
  }

  async getComment(input: { id: Number }): Promise<IComment> {
    const commentId = +input.id; //
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw new HttpError(404,"댓글이 존재 하지 않습니다");
    return comment;
  }

  async createComment(input: {
    title: string;
    content: string;
    type: string;
    productId: number;
    articleId: number;
  }): Promise<OutputCreateComment> {
    const { title, content, type, productId, articleId } = input;
    const connectedData =
      type === "Market"
        ? { connect: { id: productId } }
        : type === "ARTICLE"
        ? { connect: { id: articleId } }
        : {};
    const newComment = await prisma.comment.create({
      data: {
        title,
        ...connectedData,
        content,
      },
    });
    return newComment;
  }

  async modifyComment(input: {
    title: string;
    content: string;
    commentId: number;
  }): Promise<OutputCreateComment> {
    const { title, content, commentId } = input;

    return await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        title,
        content,
      },
    });
  }
  
  async deleteComment(input : {commentId:number}):Promise<void>{
    const commentId = input.commentId
    const isValid = await this.getComment({id:commentId})
    if (!isValid) throw new HttpError(404,"삭제하려는 댓글이 존재하지 않습니다.")
    await prisma.comment.delete({
        where:{
            id: commentId
        },
    })
  }
}
