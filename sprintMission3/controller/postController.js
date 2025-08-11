import prisma from '../prisma/prismaClient.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    
    // 유효성 검사
    if (!title || !content || !userId) {
      return res.status(400).json({ message: 'title, content, userId는 필수입니다.' })
    }
    
    const parsedUserId = Number(userId);
    if (isNaN(paresedUserId)) {
      return res.status(400).json({ message: 'userId는 숫자여야 합니다.' })
    }

    // 이미지 경로
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId: parsedUserId,
        image: imagePath,
      },
    });
    
    return res.status(201).json(newPost);
  } catch (err) {
    console.error('게시글 생성 실패:', err);
    return res.status(500).json({ message: '게시글 생성 실패', detail: err.message });
  }
};

export const deleteArticleLike = async (req, res) => {
  const articleId = Number(req.params.articleId);
  const userId = req.user.id;

  if (isNaN(articleId)) {
    return res.status(400).json({ message: '유효한 articleId가 필요합니다.' });
  }


  try {
    const existingLike = await prisma.articleLike.findFirst({
      where: {
        articleId,
        userId,
      },
    });

    if (!existingLike) {
      return res.status(404).json({ message: '좋아요를 누르지 않았습니다. '});
    }
    
    await prisma.articleLike.delete({
      where: { id: existingLike.id }, 
    });

    return res.status(200).json({ message: '좋아요 취소 완료!' });
  } catch (error) {
    console.error('게시글 좋아요 삭제 오류:', error);
    return res.status(500).json({ message: '좋아요 삭제 중 서버 오류', detail: error.message });
  }
};