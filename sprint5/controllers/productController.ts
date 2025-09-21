import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/productService.js";
import type {
  GetProductListQuery,
  ProductId,
  ProductBody,
} from "sprint5/types/dto.js";

export const productController = {
  getProductList: async (
    req: Request<{}, {}, {}, GetProductListQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const name = req.query.name;
      const description = req.query.description;

      const userId = req.user?.id || null;

      const products = await productService.getProducts(
        offset,
        limit,
        name,
        description,
        userId
      );

      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
  postProduct: async (
    req: Request<{}, {}, ProductBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, description, price, tags } = req.body;
      const userId = Number(req.user!.id);

      const product = await productService.createProduct(
        name,
        description,
        price,
        tags,
        userId
      );

      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  getProductById: async (
    req: Request<ProductId>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id || null;

      const product = await productService.getProductById(id, userId!);

      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  patchProduct: async (
    req: Request<ProductId, {}, ProductBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user!.id);

      const { name, description, price, tags } = req.body;

      const product = await productService.updateProduct(
        id,
        name,
        description,
        price,
        tags,
        userId
      );

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  deletProduct: async (
    req: Request<ProductId>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user!.id);

      await productService.deleteProduct(id, userId);

      res.status(200).json({ message: `${id} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  },
};
