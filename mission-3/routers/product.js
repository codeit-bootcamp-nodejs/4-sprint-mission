import express from 'express';
import { PrismaClient } from '@prisma/client';
import productCommentRouter from './comment.js';
import commentRouter from './comment.js';
import parentIdParser from '../middlewares/parnetIdParser.js';
import { deleteProduct, getProduct, getProductList, createProduct, patchProduct } from '../services/productService.js';

const productRouter = express.Router();
const prisma = new PrismaClient();

productRouter.use('/:id/comment', parentIdParser, commentRouter);

productRouter.route('/')
    .get(getProductList())
    .post(createProduct())

productRouter.route('/:id')
    .get(getProduct())
    .patch(patchProduct())
    .delete(deleteProduct())

export default productRouter;
