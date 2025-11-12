import prisma from "./prisma";

export async function findUniqueRepo(id: number) {
  return await prisma.comment.findUnique({ where: { id } });
}

export async function createArticleCommentRepo({
  id,
  content,
  user,
}: Comment.Create) {
  const articleId = id;
  return await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      articleId,
    },
  });
}

export async function createProductCommentRepo({
  id,
  content,
  user,
}: Comment.Create) {
  const productId: number = id;
  return await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      productId,
    },
  });
}

export async function deleteCommentRepo(id: number) {
  await prisma.comment.delete({
    where: { id },
  });
}

export async function getArticleRepo({ id, take, cursor }: Comment.Get) {
  return await prisma.comment.findMany({
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
}

export async function getProductRepo({ id, take, cursor }: Comment.Get) {
  return await prisma.comment.findMany({
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
}

export async function updateCommentRepo({
  commentId,
  content,
  user,
}: Comment.Update) {
  const id = commentId;
  return await prisma.comment.update({
    where: { id },
    data: { content, userId: user.id },
  });
}

// 게시물 작성자 찾기
export async function findArticleAuthor(articleId: number) {
  return await prisma.article.findUnique({
    where: { id: articleId },
    select: { userId: true },
  });
}
