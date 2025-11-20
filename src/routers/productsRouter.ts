import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController';

const productsRouter = express.Router();

productsRouter.post('/', authenticate(), withAsync(createProduct));
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.patch('/:id', authenticate(), withAsync(updateProduct));
productsRouter.delete('/:id', authenticate(), withAsync(deleteProduct));

export default productsRouter;
