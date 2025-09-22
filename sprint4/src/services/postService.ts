// src/services/postService.ts
import * as postRepository from '../repositories/postRepository';

export const getAllPosts = async () => {
  return postRepository.findAllPosts();
};

export const getPostById = async (id: number) => {
  const post = await postRepository.findPostById(id);
  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }
  return post;
};

export const getPostWithLikeStatus = async (id: number, userId?: number) => {
  const post = await getPostById(id);

  let isLiked = false;
  if (userId) {
    const like = await postRepository.findPostLike(userId, id);
    isLiked = !!like;
  }

  return { post, isLiked };
};

export const createPost = async (title: string, content: string, userId: number) => {
  if (!title || !content) {
    throw new Error('제목과 내용은 필수 입력사항입니다.');
  }
  return postRepository.createPost({ title, content, userId });
};

export const updatePost = async (id: number, userId: number, data: { title?: string; content?: string }) => {
  const post = await postRepository.findPostById(id);
  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  if (post.userId !== userId) {
    throw new Error('게시글을 수정할 권한이 없습니다.');
  }

  return postRepository.updatePost(id, data);
};

export const deletePost = async (id: number, userId: number) => {
  const post = await postRepository.findPostById(id);
  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  if (post.userId !== userId) {
    throw new Error('게시글을 삭제할 권한이 없습니다.');
  }

  return postRepository.deletePost(id);
};

export const likePost = async (id: number, userId: number) => {
  const post = await postRepository.findPostById(id);
  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  const existingLike = await postRepository.findPostLike(userId, id);
  if (existingLike) {
    throw new Error('이미 좋아요를 누른 게시글입니다.');
  }

  return postRepository.createPostLike(userId, id);
};

export const unlikePost = async (id: number, userId: number) => {
  const like = await postRepository.findPostLike(userId, id);
  if (!like) {
    throw new Error('좋아요를 누르지 않은 게시글입니다.');
  }

  return postRepository.deletePostLike(userId, id);
};