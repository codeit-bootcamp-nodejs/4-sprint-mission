import prisma  from '../prisma/prismaClient.js';

export const getArticleCommentLikeCount = async (req, res) => {
  const commentId = Number(req.query.commentId);

  if (!commentId) {
    return res.status(400).json({ message: 'commentId가 필요합니다.' });
  }

  try {
    const count = await prisma.articleCommentLike.count({
      where: { commentId },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error('좋아요 개수 조회 실패:', error);
    return res.status(500).json({ message: '좋아요 개수 조회 중 오류 발생', detail: error.message });
  }
};

export const createArticleCommentLike = async (req, res) => {
  const commentId = Number(req.params.commentId);
  const userId = req.user.id;

  try {
    const existingLike = await prisma.articleCommentLike.findFirst({
      where: { commentId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
    }

    const like = await prisma.articleCommentLike.create({
      data: {
        commentId,
        userId,
      },
    });

    return res.status(201).json(like);
  } catch (error) {
    console.error('좋아요 생성 실패:', error);
    return res.status(500).json({ message: '좋아요 생성 중 오류 발생', detail: error.message });
  }
};

export const deleteArticleCommentLike = async (req, res) => {
  const commentId  = Number(req.params.commentId);
  const userId = req.user.id;

  try {
    const existingLike = await prisma.articleCommentLike.findFirst({
      where: { 
        commentId,
        userId 
      },
    });
      
      if (!existingLike) {
      return res.status(404).json({ message: '좋아요가 존재하지 않습니다.' });
    }
    
    await prisma.articleCommentLike.delete({
      where: { id: existingLike.id },
    });

    return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    console.error('좋아요 삭제 실패:', error);
    return res.status(500).json({ message: '좋아요 삭제 중 오류 발생', detail: error.message });
  }
};
