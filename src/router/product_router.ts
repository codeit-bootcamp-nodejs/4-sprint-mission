//src/router/product_router.ts
import { Router } from 'express';
import productController from '../controllers/product_controller';
import { authenticate } from '../middlewares/auth_middleware';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', authenticate, productController.createProduct);
router.patch('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.post('/:id/like', authenticate, productController.likeProduct);

export default router;