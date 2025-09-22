// src/repositories/postRepository.ts
import { PrismaClient, Post, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const findAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      comments: {
        include: { user: { select: { id: true, nickname: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { likes: true } },
    },
  });
};

export const createPost = async (data: { title: string; content: string; userId: number }) => {
  return prisma.post.create({
    data,
    include: {
      user: { select: { id: true, nickname: true, image: true } }
    }
  });
};

export const updatePost = async (id: number, data: { title?: string; content?: string }) => {
  return prisma.post.update({ 
    where: { id },
    data,
    include: {
      user: { select: { id: true, nickname: true, image: true } }
    }
  });
};

export const deletePost = async (id: number) => {
  return prisma.post.delete({ where: { id } });
};

export const findPostLike = async (userId: number, postId: number) => {
  return prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });
};

export const createPostLike = async (userId: number, postId: number) => {
  return prisma.postLike.create({
    data: { userId, postId }
  });
};

export const deletePostLike = async (userId: number, postId: number) => {
  return prisma.postLike.delete({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });
};