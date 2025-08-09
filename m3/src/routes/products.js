import express from 'express';
import { assert } from 'superstruct';
import asyncHandler from '../core/middlewares/asyncHandler.js';
import { validateId } from '../core/middlewares/validateId.js';
import { CreateProduct, PatchProduct, CreateComment } from '../validators/structs.js';
import { productService } from '../services/productService.js';

const productRouter = express.Router();

// 상품 목록 조회 및 생성
productRouter
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const products = await productService.getAllProducts(req.query);
      res.json(products);
    }),
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    }),
  );

// 상품 상세 조회, 수정, 삭제
productRouter
  .route('/:id')
  .get(
    validateId,
    asyncHandler(async (req, res) => {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    }),
  )
  .patch(
    validateId,
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    }),
  )
  .delete(
    validateId,
    asyncHandler(async (req, res) => {
      await productService.deleteProduct(req.params.id);
      res.sendStatus(204);
    }),
  );

// 상품 댓글 조회 및 생성
productRouter
  .route('/:id/comments')
  .get(
    validateId,
    asyncHandler(async (req, res) => {
      const result = await productService.getProductComments(req.params.id, req.query);
      res.json(result);
    }),
  )
  .post(
    validateId,
    asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);
      const comment = await productService.createCommentForProduct(req.params.id, req.body);
      res.status(201).json(comment);
    }),
  );

export default productRouter;
