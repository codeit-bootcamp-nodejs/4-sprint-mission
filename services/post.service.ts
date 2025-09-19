import prisma from '../prisma/prisma.js';
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import type { Post } from "@prisma/client";
// 게시글 목록 조회
export async function postListService(userId: number): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}[]> {
  const listup = await prisma.post.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true
    }
  })
  if ( listup.length === 0)  {
    throw new HttpError("등록한 게시글이 없습니다.", 404);
  }
  return listup;
}
// 로그인한 유저만 게시글 등록 가능
export async function postRegisterService(userId: number, title: string, content: string): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}> {
  // 유효성 검사
  if (!title || !content) {
    throw new HttpError("제목과 내용을 입력해주세요.", 404);
  };
  // 게시글 생성
  const CreatePost = await prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return CreatePost;
}

// 게시글을 등록한 유저만 해당 글을 수정할 수 있음
export async function postPutService(userId: number, postId: number, title: string, content: string): Promise<{
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  // DB에서 게시글 정보 가져오기
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });
  
  if (!post) {
    throw new HttpError("게시글을 찾을 수 없습니다.", 404);
  }
  
  // 게시글이 사용자가 게시한 글인지 확인
  if (post.userId !== userId) {
    throw new HttpError("게시글은 작성자만 수정할 수 있습니다.", 403);
  };
  
  // 게시글 수정
  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedPost; 
}


// 게시글을 등록한 유저만 해당 글을 삭제할 수 있음
export async function postDeleteService(userId: number, postId: number): Promise<Post> {
  // 게시글 DB 가져오기
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  if (!post) {
    throw new HttpError("게시글을 찾을 수 없습니다..", 404);
  }

  // 게시글 작성자인지 확인하기
  if (post.userId !== userId) {
    throw new HttpError("게시글은 작성자만 삭제할 수 있습니다.", 403);
  }

  // 게시글 삭제
  const deletedPost = await prisma.post.delete({
    where: { id: Number(postId) },
  });

  return deletedPost;
}