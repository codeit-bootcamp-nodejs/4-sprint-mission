//src/router/product_router.ts
import { Router } from 'express';
import productController from '../controllers/product_controller';

const router = Router();

router.patch('/:id', productController.updateProduct);
router.post('/:id/like', productController.likeProduct);

export default router;