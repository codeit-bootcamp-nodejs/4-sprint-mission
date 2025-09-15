import prisma from "../../lib/prisma.js";

export async function createPost({ userId, title, content }) {
  return await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });
}

export async function getPosts({ offset, limit, sort, search }) {
  // search에 값이 있을 때만 where로 문자열 검색
  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const result = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: sort,
    },
    where,
    skip: offset * limit,
    take: limit,
  });

  return result;
}

export async function getPost(id) {
  const result = await prisma.article.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return result;
}

export async function patchPost({ id, ...filteredBody }) {
  const result = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      ...filteredBody,
    },
  });

  return result;
}

export async function deletePost(id) {
  const result = await prisma.article.delete({
    where: {
      id: Number(id),
    },
  });

  return result;
}

export async function postComment({ userId, pid, name, content }) {
  const result = await prisma.comment.create({
    data: {
      name,
      content,
      articleId: pid,
      userId,
    },
  });

  return result;
}

export async function getComments({ pid, cursor, limit }) {
  const result = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    where: {
      articleId: Number(pid),
    },
    orderBy: {
      id: "asc",
    },
    take: Number(limit),
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: Number(cursor) },
        }
      : {}),
  });

  return result;
}

export async function getComment(cid) {
  const result = await prisma.comment.findUnique({
    where: {
      id: cid,
    },
  });

  return result;
}

export async function patchComment({ cid, name, content }) {
  const result = await prisma.comment.update({
    where: {
      id: Number(cid),
    },
    data: {
      name,
      content,
    },
  });

  return result;
}

export async function deleteComment(cid) {
  const result = prisma.comment.delete({
    where: {
      id: Number(cid),
    },
  });

  return result;
}
