import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 댓글 생성 (상품 또는 게시글)
export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    // URL 파라미터에서 productId 또는 articleId를 가져옴
    const { productId, articleId } = req.params;

    const newComment = await prisma.comment.create({
      data: {
        content,
        // productId 또는 articleId 중 하나만 존재하므로, 해당 ID와 연결
        productId: productId ? parseInt(productId) : undefined,
        articleId: articleId ? parseInt(articleId) : undefined,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 목록 조회 (상품 또는 게시글)
export const getComments = async (req, res, next) => {
  try {
    const { productId, articleId } = req.params;
    const limit = parseInt(req.query.limit || '10');
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;

    const comments = await prisma.comment.findMany({
      where: {
        // productId 또는 articleId를 기준으로 필터링
        productId: productId ? parseInt(productId) : undefined,
        articleId: articleId ? parseInt(articleId) : undefined,
      },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
      select: { id: true, content: true, createdAt: true },
    });

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    res.json({ data: comments, nextCursor });
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
