import {
  createProductComment,
  updateProductComment,
  deleteProductComment,
  listProductComment,
  getProductCommentById,
} from "../services/productCommentService.js";

export async function createProductCommentController(req, res, next) {
  try {
    const productId = req.params.productId;

    const { content } = req.body;
    const productCommentData = { content, productId, userId: req.user.id };
    const productComment = await createProductComment(productCommentData);
    res.status(201).json(productComment);
  } catch (error) {
    next(error);
  }
}

export async function updateProductCommentController(req, res, next) {
  try {
    const commentId = req.params.commentId;

    // 기존 댓글 조회
    const comment = await getProductCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    const { content } = req.body;

    const pdCommentPatched = await updateProductComment(commentId, {
      content,
    });
    res.status(200).json(pdCommentPatched);
  } catch (error) {
    next(error);
  }
}

export async function deleteProductCommentController(req, res, next) {
  try {
    const commentId = req.params.commentId;

    // 기존 댓글 조회
    const comment = await getProductCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    await deleteProductComment(commentId);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}

export async function listProductCommentController(req, res, next) {
  try {
    const productId = req.params.productId;

    const cursor = req.query.cursor;
    const limit = req.query.limit;

    const productComments = await listProductComment(productId, {
      cursor,
      limit,
    });
    res.status(200).json({
      comments: productComments,
      nextCursor:
        productComments.length > 0
          ? productComments[productComments.length - 1].createdAt
          : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductCommentByIdController(req, res, next) {
  try {
    const commentId = req.params.commentId;
    const productComment = await getProductCommentById(commentId);
    if (!productComment) {
      return res
        .status(404)
        .json({ error: `${commentId}에 해당하는 댓글을 찾을 수 없습니다` });
    }

    res.status(200).json(productComment);
  } catch (error) {
    next(error);
  }
}
