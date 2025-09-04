import prisma from "../prisma.js";

export async function createArticleCommentService({ id, content }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      article: { connect: { id } },
    },
  });
  return comment;
}

export async function createProductCommentService({ id, content }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      product: { connect: { id } },
    },
  });
  return comment;
}
