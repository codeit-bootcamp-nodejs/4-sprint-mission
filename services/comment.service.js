import prisma from '../prisma/prisma.js';


// 댓글 목록 조회
export async function CommentListService(userId){
  const listup = await prisma.comment.findMany({
    where: { userId: userId},
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (listup === 0) {
    const error = new Error("등록한 댓글이 없습니다")
    error.status = 404;
    throw error;
  }
  return listup;
}
// 로그인한 유저만 상품에 댓글을 등록할 수 있습니다.
export async function CommentRegisterProductService(userId, productId, content) {
  // 유효성 검사
  if (!content) {
    const error = new Error("내용을 입력해주세요")
    error.status = 404;
    throw error;
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
export async function CommentRegisterPostService(userId, postId, content) {
  // 유효성 검사
  if (!content) {
    const error = new Error("내용을 입력해주세요")
    error.status = 404;
    throw error;
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
export async function CommentPutService(userId, commentId, content) {
  // DB에서 댓글 정보 가져오기
  const comment = await prisma.comment.findUnique({ where: { id : Number(commentId)} });
    
  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  };

  // 댓글이 사용자가 작성한 댓글인지 확인.
  if (userId !== comment.userId) {
    const error = new Error("댓글은 작성자만 수정할 수 있습니다.")
    error.status = 403;
    throw error;
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
export async function CommentDeleteService(userId, commentId) {
  // 댓글 DB 가져오기
  const comment = await prisma.comment.findUnique({ where: { id : Number(commentId)} });

  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.")
    error.status = 404;
    throw error;
    }

  // 댓글 작성자인지 확인
  if (userId !== comment.userId) {
    const error = new Error("댓글은 작성자만 삭제할 수 있습니다.")
    error.status = 403;
    throw error;
    }

  // 댓글 삭제
  const deletedComment = await prisma.comment.delete({ where: { id: Number(commentId) } });

  return deletedComment;

}