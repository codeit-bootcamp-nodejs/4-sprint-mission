import prisma from "./prisma";

export async function createArticleCommentService({
  id,
  content,
  user,
}: Comment.Create) {
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

export async function createProductCommentService({
  id,
  content,
  user,
}: Comment.Create) {
  const productId: number = id;
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      productId,
    },
  });
  return comment;
}

export async function deleteCommentService({
  commentId,
  user,
}: Comment.Delete) {
  const id = commentId;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.comment.delete({
    where: { id },
  });
}

export async function getArticleCommentService({
  id,
  take,
  cursor,
}: Comment.Get) {
  const comment = await prisma.comment.findMany({
    where: { articleId: id },
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
  return comment;
}

export async function getProductCommentService({
  id,
  take,
  cursor,
}: Comment.Get) {
  const comment = await prisma.comment.findMany({
    where: { productId: id },
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
  return comment;
}

export async function updateCommentService({
  commentId,
  content,
  user,
}: Comment.Update) {
  const id = commentId;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
  const updated = await prisma.comment.update({
    where: { id },
    data: { content, userId: user.id },
  });
  return updated;
}
