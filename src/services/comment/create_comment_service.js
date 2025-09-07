import prisma from "../prisma.js";

export async function createArticleCommentService({ id, content, user }) {
  const articleId = id;
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      articleId,
    },
  });
  return comment;
}

export async function createProductCommentService({ id, content, user }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      product: { connect: { id } },
    },
  });
  return comment;
}
