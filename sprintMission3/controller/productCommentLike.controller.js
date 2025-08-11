import prisma from '../prisma/prismaClient.js';

export const getProductCommentLikeCount = async (req, res) => {
  const commentId = Number(req.query.comment);

  if (!commentId) {
    return res.status(400).json({ message: 'commentId가 필요합니다.' });
  }

  try {
    const count = await prisma.productCommentLike.count({
      where: { commentId },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error('좋아요 개수 조회 실패:', error);
    return res.status(500).json({ message: '좋아요 개수 조회 중 오류 발생', detail: error.message })
  }
};


// 상품 댓글 좋아요 생성
export const createProductCommentLike = async (req, res) => {
  const commentId = Number(req.params.commentId);
  const userId = req.user.id;
    
    try {
      // 이미 좋아요 눌렀는지 확인
      const existingLike = await prisma.productCommentLike.findFirst({
        where: { commentId, userId },
      });

      if (existingLike) {
        return res.status(400).json({ message: '이미 좋아요를 누른 댓글입니다.'});
      }

      // 좋아요 생성
      const Like = await prisma.productCommentLike.create({
        data: { 
          commentId, 
          userId, 
        },
      });

      return res.status(201).json(Like);
    } catch (error) {
      console.error('좋아요 생성 실패:', error);
      res.status(500).json({ message: '좋아요 생성 중 오류 발생', detail: error.message });
    }
  };

  export const deleteProductCommentLike = async (req, res) => {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;
    
    try {
      // 좋아요가 있는지 먼저 확인
      const existingLike = await prisma.productCommentLike.findFirst({
        where: {
          commentId,
          userId,
        }
      });

      if (!existingLike) {
        return res.status(404).json({ message: '좋아요가 존재하지 않습니다.' });
      }

      // 좋아요 삭제
      await prisma.productCommentLike.delete({
        where: { id: existingLike.id }
      });

      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } catch (error) {
      console.error('좋아요 삭제 실패:', error);
      res.status(500).json({ message: '좋아요 삭제 중 오류 발생', detail: error.message });
    }
  };