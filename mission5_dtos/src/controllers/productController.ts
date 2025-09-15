import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import status from "http-status";
import { ProductService } from "../services/productService";

const productService = new ProductService();

// body 검증(생성)
const productSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().default(""),
});

// body 검증(수정)
const productUpdateSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }).optional(),
  description: z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }).optional(),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }).optional(),
  tags: z.string().default("").optional(),
});

// query 검증
const productQuerySchema = z.object({
  page: z.string().default("1").transform(Number).refine((v) => v > 0),
  pageSize: z.string().default("5").transform(Number).refine((v) => v > 0 && v <= 100),
  keyword: z.string().default(""),
});

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const parsed = productSchema.parse(req.body);
      const product = await productService.create(req.user.id, parsed);
      res.status(status.CREATED).json(product);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, keyword } = productQuerySchema.parse(req.query);
      const products = await productService.list(page, pageSize, keyword);
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
      const parsed = productUpdateSchema.parse(req.body) as { name?: string; description?: string; price?: number; tags?: string; };
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