import express from 'express';
import {
  validateId,
  validateCommentId,
  validateProductData,
  validateCommentData,
  validateProductUpdateData,
} from './validation.js';
import { productService, commentService } from './services.js';

const router = express.Router();

// 상품 목록 조회 API
router
  .route('/')
  .get(async (req, res) => {
    const { data, pagination } = await productService.getAllProducts(req.query);
    res.send({ data, pagination });
  })
  .post(validateProductData, async (req, res) => {
    const { name, description, price, tags } = req.body;
    const newProduct = await productService.createProduct(
      name,
      description,
      price,
      tags
    );
    res.status(201).json(newProduct);
  });

// 상품 상세 조회 API
router
  .route('/:id')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json(product);
  })
  // 상품 수정 API
  .patch(validateId, validateProductUpdateData, async (req, res) => {
    const { id } = req.params;
    const { updateData } = req.body;
    const updateProduct = await productService.updateProduct(id, updateData);
    res.status(200).json(updateProduct);
  })
  // 상품 삭제 API
  .delete(validateId, async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
  });
// 댓글

// 댓글 목록 조회, 생성
router
  .route('/:id/comments')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const comments = await commentService.getCommentsByProductId(id);
    res.json(comments);
  })
  .post(validateId, validateCommentData, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const newComment = await commentService.createProductComment(id, content);
    res.status(201).json(newComment);
  });
// 댓글 상세조회, 수정, 삭제
router
  .route('/:id/comments/:commentId')
  .get(validateId, validateCommentId, async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await commentService.getCommentByIdProductId(id, commentId);
    res.json(comment);
  })
  .patch(validateCommentId, validateCommentData, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const updateComment = await commentService.updateComment(
      commentId,
      content
    );
    res.status(200).json(updateComment);
  })
  .delete(validateCommentId, async (req, res) => {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  });

export default router;
