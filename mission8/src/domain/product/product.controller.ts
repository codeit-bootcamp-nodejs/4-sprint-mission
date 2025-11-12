import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/exception.js';
import { productService } from './product.service.js';
import type { UpdatePriceParams } from './product.type.js';

class ProductController {
  updatePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }
      const userId = Number(req.user.id);
      const productId = Number(req.params['productId']);
      const price = req.body.price;

      const params: UpdatePriceParams = { userId, productId, price };

      const result = await productService.updatePrice(params);
      res.status(STATUS_CODE.SUCCESS).json({ message: MESSAGE.successUpdatePrice, productId, newPrice: price });
    } catch (err) {
      next(err);
    }
  };
}
export const productController = new ProductController();
