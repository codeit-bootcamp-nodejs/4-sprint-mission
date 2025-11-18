import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { ProductService } from "../services/productService";
import { ProductCreateSchema, ProductUpdateSchema, ProductQuerySchema } from "../dtos/product.dto";

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const parsed = ProductCreateSchema.parse(req.body);
      const product = await productService.create(req.user.id, parsed);
      res.status(status.CREATED).json(product);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ProductQuerySchema.parse(req.query);
      const products = await productService.list(parsed);
      res.status(status.OK).json(products);
    } catch (err) {
      next(err);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const product = await productService.getDetail(productId);
      if (!product) return res.status(status.NOT_FOUND).json({ message: "Product not found" });
      res.status(status.OK).json(product);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const parsed = ProductUpdateSchema.parse(req.body) as { name?: string; description?: string; price?: number; tags?: string; };
      const productId = Number(req.params.id);
      const updated = await productService.update(req.user.id, productId, parsed);
      
      res.status(status.OK).json(updated);
    } catch (err: any) {
      if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Product not found" });
      if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const productId = Number(req.params.id);
      await productService.delete(req.user.id, productId);
      res.status(status.NO_CONTENT).end();
    } catch (err: any) {
      if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Product not found" });
      if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
      next(err);
    }
  }
}