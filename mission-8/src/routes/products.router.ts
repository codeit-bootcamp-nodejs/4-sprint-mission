import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuthMiddleware from '../middlewares/optional-auth.middleware.js';
import { ProductsController } from '../controllers/products.controller.js';

const router = express.Router();
const productsController = new ProductsController();

/** 상품 등록 **/
router.post('/products', authMiddleware, productsController.createProduct);

/** 상품 목록 조회 **/
router.get('/products', productsController.getProducts);

/** 상품 상세 조회 **/
router.get('/products/:productId', optionalAuthMiddleware, productsController.getProductById);

/** 상품 수정 **/
router.put('/products/:productId', authMiddleware, productsController.updateProduct);

/** 상품 삭제 **/
router.delete('/products/:productId', authMiddleware, productsController.deleteProduct);

/** 상품 좋아요/ 좋아요 취소 **/
router.post('/products/:productId/like', authMiddleware, productsController.toggleProductLike);

export default router;
