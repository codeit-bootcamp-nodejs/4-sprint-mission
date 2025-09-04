import {
  createProductComment,
  findProductsComments,
  removeProductComment,
  updateProductComment,
} from "../services/productCommentsService.js";

export const getProductsComments = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { cursor, limit = 10 } = req.query;

    const productComments = await findProductsComments(
      productId,
      cursor,
      limit
    );

    if (productComments.length === 0) {
      return res
        .status(400)
        .json({ message: "선택한 범위 내 댓글을 찾을 수 없습니다." });
    }

    res.status(200).json(productComments);
  } catch (err) {
    next(err);
  }
};

export const postProductComment = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { content } = req.body;

    const comment = await createProductComment(productId, content);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const patchProductComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const productId = Number(req.params.productId);
    const { content } = req.body;

    const comment = await updateProductComment(productId, commentId, content);

    res.status(200).json(comment);
  } catch (err) {
    if (err.message === "댓글을 찾을 수 없습니다.") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

export const deleteProductComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const productId = Number(req.params.productId);

    await removeProductComment(commentId, productId);

    res.status(200).json({ message: `ID:${commentId} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
