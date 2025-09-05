//src/controllers/commentController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 댓글 생성 (상품 또는 게시글에)
exports.createComment = async (req, res) => {
  try {
    const { content, postId, productId } = req.body;

    // 필수 필드 검증
    if (!content) {
      return res.status(400).json({ message: '댓글 내용은 필수 입력사항입니다.' });
    }

    // postId 또는 productId 둘 중 하나는 있어야 함
    if (!postId && !productId) {
      return res.status(400).json({ message: '게시글 또는 상품 ID가 필요합니다.' });
    }

    // 둘 다 있으면 안 됨
    if (postId && productId) {
      return res.status(400).json({ message: '게시글 또는 상품 ID 중 하나만 지정해야 합니다.' });
    }

    // 게시글이나 상품이 존재하는지 확인
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) }
      });
      if (!post) {
        return res.status(404).json({ message: '해당 게시글을 찾을 수 없습니다.' });
      }
    }

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });
      if (!product) {
        return res.status(404).json({ message: '해당 상품을 찾을 수 없습니다.' });
      }
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.userId,
        ...(postId && { postId: parseInt(postId) }),
        ...(productId && { productId: parseInt(productId) })
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      }
    });

    res.status(201).json({
      message: '댓글이 성공적으로 등록되었습니다.',
      comment
    });
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 수정 (소유권 확인)
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: '댓글 내용은 필수 입력사항입니다.' });
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 소유권 확인
    if (comment.userId !== req.userId) {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({
      message: '댓글이 성공적으로 수정되었습니다.',
      comment: updatedComment
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 삭제 (소유권 확인)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 소유권 확인
    if (comment.userId !== req.userId) {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 또는 상품의 댓글 목록 조회
exports.getComments = async (req, res) => {
  try {
    const { postId, productId } = req.query;

    // postId 또는 productId 둘 중 하나는 있어야 함
    if (!postId && !productId) {
      return res.status(400).json({ message: '게시글 또는 상품 ID가 필요합니다.' });
    }

    // 둘 다 있으면 안 됨
    if (postId && productId) {
      return res.status(400).json({ message: '게시글 또는 상품 ID 중 하나만 지정해야 합니다.' });
    }

    const comments = await prisma.comment.findMany({
      where: {
        ...(postId && { postId: parseInt(postId) }),
        ...(productId && { productId: parseInt(productId) })
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};