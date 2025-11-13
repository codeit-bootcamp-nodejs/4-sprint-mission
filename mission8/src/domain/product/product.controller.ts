import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { productService } from './product.service.js';
import type { UpdatePriceInput } from './product.type.js';

class ProductController {
  updatePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }
      const userId = req.user.id;
      const productId = Number(req.params['productId']);
      const price = req.body.price;

      const updatePriceData: UpdatePriceInput = { userId, productId, price };

      await productService.updatePrice(updatePriceData);
      res.status(STATUS_CODE.OK).json({ message: MESSAGE.successUpdatePrice, productId, newPrice: price });
    } catch (err) {
      next(err);
    }
  };
}
export const productController = new ProductController();
