
import prisma from "../../lib/prisma.js";

export class CommentService {
  async getCommentListService({ type, takeNumber, skip }) {
    const whereFields =
      type === "MARKET" ? { productId: Number(id) } : { articleId: Number(id) };
    const includeFields =
      type === "MARKET" ? { product: true } : { article: true };
    const commentList = await prisma.comment.findMany({
      where: whereFields,
      include: includeFields,
      take: takeNumber,
      skip,
    });
    return commentList;
  }

  async getCommentService( commentId ) {
    const comment = await prisma.comment.findUnique({
      where:{
        id : commentId
      }
    })
    if(!comment) throw{ status : 404, message:"해당 댓글이 존재 하지않습니다"}
    return comment
  }

  async createCommentService({ content, title, articleId, productId, type }) {
    const connectedData =
      type === "MARKET"
        ? { product: { connect: { id: productId } } }
        : { article: { connect: { id: articleId } } };
    const newComment = await prisma.comment.create({
      data: {
        title,
        content,
        type: type,
        ...connectedData,
        createdAt,
      },
    });
    return newComment;
  }

  async updatedCommentService({ commentId, title, content }) {
    return await prisma.comment.update({
      where:  commentId ,
      data: {
        title,
        content,
      },
    });
  }

  async deleteCommentService( commentId ) {
    await this.getCommentService(commentId)
    return await prisma.comment.delete({ where:  commentId  });
  }
}
