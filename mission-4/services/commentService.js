import prisma from "../lib/prisma.js";

async function getCommentListService({ cursorId, pageSize, parentType }) {
  const where = parentType === "product" ? { productId: { not: null } } : { articleId: { not: null } };
  const query = {
    where,
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
    take: pageSize,
  };
  if (cursorId) {
    query.cursor = { id: cursorId };
    query.skip = 1;
  }
  const comment = await prisma.comment.findMany(query);
  return comment;
}

async function postCommentService({ userId, parentId, parentType, content }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      [`${parentType}Id`]: parentId,
      userId,
    },
    include: {
      [parentType]: true,
    },
  });
  return comment;
}

async function patchCommentService({ id, content }) {
  const comment = await prisma.comment.update({
    where: id,
    data: {
      content,
    },
  });
  return comment;
}

async function deleteCommentService({ id }) {
  const comment = await prisma.comment.delete({
    where: id,
  });
  return comment;
}

export { getCommentListService, postCommentService, patchCommentService, deleteCommentService };
