import commentService from '../services/commentService';

const commentController = {
  async createProductComment(req, res, next) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { content } = req.body;
      const productCommentData = { content, productId };
      const productComment = await commentService.createProductComment(
        productCommentData
      );
      res.status(201).json(productComment);
    } catch (error) {
      next(error);
    }
  },

  async createArticleComment(req, res, next) {
    try {
      const articleId = Number(req.params.articleId);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { content } = req.body;
      const articleCommentData = { content, productId };
      const articleComment = await commentService.createarticleComment(
        articleCommentData
      );
      res.status(201).json(articleComment);
    } catch (error) {
      next(error);
    }
  },

  async updateProductComment(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { content } = req.body;
      const updateProductData = { content, commentId };
      const pdCommentPatched = await commentService.updateProductComment(
        updateProductData
      );
      res.status(200).json(pdCommentPatched);
    } catch (error) {
      next(error);
    }
  },

  async updateArticleComment(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { content } = req.body;
      const updateArticleData = { content, commentId };
      const atcCommentPatched = await commentService.updateArticleComment(
        updateArticleData
      );
      res.status(200).json(atcCommentPatched);
    } catch (error) {
      next(error);
    }
  },

  async deleteProductComment(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const productComment = await commentService.deleteProductComment(
        commentId
      );
      res.status(204).json(productComment);
    } catch (error) {
      next(error);
    }
  },

  async deleteArticleComment(req, res, next) {
    try {
      const commentId = Number(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const articleComment = await commentService.deleteArticleComment(
        commentId
      );
      res.status(204).json(articleComment);
    } catch (error) {
      next(error);
    }
  },

  async listProductComment(req, res, next) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const cursor = req.query.cursor;
      const limit = Number(req.query.limit) || 10;
      const productData = { productId, cursor, limit };
      const productComments = await commentService.listProductComment(
        productData
      );
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
  },

  async listArticleComment(req, res, next) {
    try {
      const articleId = Number(req.params.articleId);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const cursor = req.query.cursor;
      const limit = Number(req.query.limit) || 10;
      const articleData = { articleId, cursor, limit };
      const articleComments = await commentService.listArticleComment(
        articleData
      );
      res.status(200).json({
        comments: articleComments,
        nextCursor:
          articleComments.length > 0
            ? articleComments[articleComments.length - 1].createdAt
            : null,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;
