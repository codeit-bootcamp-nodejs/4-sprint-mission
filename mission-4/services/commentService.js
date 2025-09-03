import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCommentListService({ cursorId, pageSize, parentType }) {
  const where =
    parentType === "product"
      ? { productId: { not: null } }
      : { articleId: { not: null } };
  const query = {
    where,
    select: {
      id: true,
      content: true,
      createdAt: true,
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

async function postCommentService({ parentId, parentType, content }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      [parentType]: {
        connect: {
          id: parentId,
        },
      },
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

export {
  getCommentListService,
  postCommentService,
  patchCommentService,
  deleteCommentService,
};
