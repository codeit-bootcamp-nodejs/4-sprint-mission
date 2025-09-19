import prisma from '../prisma/prisma.js';
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import type { Comment } from "@prisma/client"

// 댓글 목록 조회
export async function commentListService(userId: number): Promise<{
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}[]> {
  const listup = await prisma.comment.findMany({
    where: { userId: userId},
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (listup.length === 0) {
    throw new HttpError("등록한 댓글이 없습니다.", 404);
  }
  return listup;
}


// 로그인한 유저만 상품에 댓글을 등록할 수 있습니다.
export async function commentRegisterProductService(userId: number, productId: number, content: string): Promise<{
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  // 유효성 검사
  if (!content) {
    throw new HttpError("내용을 입력해주세요.", 404);
  };

  // 댓글 생성
  const CreatedComment = await prisma.comment.create({
    data: {
      content,
      userId,
      productId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return CreatedComment;
}


// 로그인한 유저만 게시글에 댓글을 등록할 수 있습니다.
export async function commentRegisterPostService(userId: number, postId: number, content: string): Promise<{
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  // 유효성 검사
  if (!content) {
    throw new HttpError("내용을 입력해주세요", 404);
  };
    
  // 댓글 생성
  const createdComment = await prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  return createdComment;
}


// 댓글을 단 유저만 해당 댓글을 수정할 수 있습니다.
export async function commentPutService(userId: number, commentId: number, content: string): Promise<{
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  // DB에서 댓글 정보 가져오기
  const comment = await prisma.comment.findUnique({ where: { id : Number(commentId)} });
    
  if (!comment) {
    throw new HttpError("댓글을 찾을 수 없습니다.", 404);
  };

  // 댓글이 사용자가 작성한 댓글인지 확인.
  if (userId !== comment.userId) {
    throw new HttpError("댓글은 작성자만 수정할 수 있습니다.", 403);
  };

  // 댓글 수정
  const updatedComment = await prisma.comment.update({
    where: { id : Number(commentId)},
    data: { content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  return updatedComment;
}


// 댓글을 단 유저만 해당 댓글을 삭제할 수 있습니다.
export async function commentDeleteService(userId: number, commentId: number): Promise<Comment>
{
  // 댓글 DB 가져오기
  const comment = await prisma.comment.findUnique({ where: { id : commentId } });

  if (!comment) {
    throw new HttpError("댓글을 찾을 수 없습니다.", 404);
    }

  // 댓글 작성자인지 확인
  if (userId !== comment.userId) {
    throw new HttpError("댓글은 작성자만 삭제할 수 있습니다.", 403);
    }

  // 댓글 삭제
  return await prisma.comment.delete({ where: { id: commentId } });

}