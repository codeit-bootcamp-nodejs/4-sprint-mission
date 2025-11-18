//src/routers/product_router.ts
import { Router } from 'express';
import productController from '../controllers/product_controller';
import { authenticate } from '../middlewares/auth_middleware';
import upload from '../middlewares/upload_middleware';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', authenticate, upload.single('image'), productController.createProduct);
router.patch('/:id', authenticate, upload.single('image'), productController.updateProduct);

router.delete('/:id', authenticate, productController.deleteProduct);
router.post('/:id/like', authenticate, productController.likeProduct);

export default router;