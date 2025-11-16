import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import { updateProductPrice } from './productController';
import authenticate from '../middlewares/authenticate';

const productRoutes = Router();

// 좋아요한 상품의 가격이 변동되었을 때 알림
productRoutes.patch('/:id/price', authenticate(), withAsync(updateProductPrice));

export default productRoutes;
