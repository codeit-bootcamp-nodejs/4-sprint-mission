import prisma from '../prisma/prisma.js';
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import type { Comment } from "@prisma/client"
import { sendNotificationToUser } from '../app.js';
import { createNotification } from './notification.service.js';

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
    throw new HttpError("내용을 입력해주세요.", 400);
  };

  // 댓글 생성
  const createdComment = await prisma.comment.create({
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
  return createdComment;
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
    throw new HttpError("내용을 입력해주세요", 400);
  };
  
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true, title: true }
  });

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
  
  // 자신이 작성한 게시글에 댓글이 달렸을 떄 알림 전송
  if (post?.userId !== userId) {
    await createNotification({
      userId: post!.userId,
      type: "새로운 댓글",
      message: `"${post!.title}" 게시글에 새로운 댓글이 달렸습니다.`,
      productId: null,
      postId: postId
    });
    // WebSocket으로 실시간 알림 전송
    sendNotificationToUser(userId, {
      id: createdComment.id,
      content: createdComment.content,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
    });
  }
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