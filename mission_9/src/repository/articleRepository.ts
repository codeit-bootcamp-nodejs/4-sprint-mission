import prisma from "../lib/prisma.js";
import type {
  CreatePostDTO,
  GetPostsDTO,
  GetPostDTO,
  PatchPostDTO,
  DeletePostDTO,
  PostCommentDTO,
  GetCommentsDTO,
  GetCommentDTO,
  PatchCommentDTO,
  DeleteCommentDTO,
} from "../types/article.js";

export async function createPost(data: CreatePostDTO) {
  return await prisma.article.create({
    data,
  });
}

export async function getPosts(data: GetPostsDTO) {
  // search에 값이 있을 때만 where로 문자열 검색
  const where = data.search
    ? {
        OR: [
          {
            title: {
              contains: data.search,
              mode: "insensitive" as const,
            },
          },
          {
            content: {
              contains: data.search,
              mode: "insensitive" as const,
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
      createdAt: data.sort,
    },
    where,
    skip: data.offset * data.limit,
    take: data.limit,
  });

  return result;
}

export async function getPost(data: GetPostDTO) {
  const result = await prisma.article.findUnique({
    where: {
      id: data.id,
    },
  });

  return result;
}

export async function patchPost(data: PatchPostDTO) {
  const { id, ...filteredBody } = data;

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

export async function deletePost(data: DeletePostDTO) {
  const { id } = data;

  const result = await prisma.article.delete({
    where: {
      id,
    },
  });

  return result;
}

export async function postComment(data: PostCommentDTO) {
  const { pid: articleId, name, content, userId } = data;

  const result = await prisma.comment.create({
    data: {
      name,
      content,
      articleId,
      userId,
    },
  });

  return result;
}

export async function getComments(data: GetCommentsDTO) {
  const { pid, cursor, limit } = data;

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

export async function getComment(data: GetCommentDTO) {
  const { cid: id } = data;

  const result = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  return result;
}

export async function patchComment(data: PatchCommentDTO) {
  const { cid, name, content } = data;

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

export async function deleteComment(data: DeleteCommentDTO) {
  const { cid } = data;
  
  const result = prisma.comment.delete({
    where: {
      id: Number(cid),
    },
  });

  return result;
}
