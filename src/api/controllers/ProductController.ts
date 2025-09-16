import ProductService from "../services/ProductService.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../libs/constants.js";
import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "src/api/types/error.js";
import type { ProductDto } from "../types/dtos/product.dto.js";

const ProductController = {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const productData: ProductDto = req.body;
      const newProduct = await ProductService.createProduct(productData, userId);

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },

  async findUniqueProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const productId = Number(id);

      let userId = null;
      const token = req.cookies.accessToken;

      if (token) {
        try {
          const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
          if (typeof decoded === "string" || !decoded.id) {
            const error: CustomError = new Error("유효하지 않은 Token입니다.");
            error.statusCode = 403;
            throw error;
          }
          userId = decoded.userId;
        } catch (err) {
          console.error("토큰 검증 오류:", err);
        }
      }

      const product = await ProductService.findUniqueProduct(productId, userId);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  async patchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const updateData: ProductDto = req.body;

      const product = await ProductService.patchProduct(Number(id), updateData, userId);
      if (!product) {
        return res.status(404).json({ error: "수정할 상품이 없음" });
      }
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      await ProductService.deleteProduct(Number(id), userId);

      res.status(204).json({ success: "상품 삭제 성공" });
    } catch (err) {
      next(err);
    }
  },

  async findManyProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset = 0, limit = 10, order = "recent", keyword } = req.query;

      const finalOffset = Number(offset) || 0;
      const finalLimit = Number(limit) || 10;
      const finalOrder = typeof order === "string" ? order : "recent";
      const finalKeyword = typeof keyword === "string" ? keyword : undefined;

      const products = await ProductService.findManyProduct({
        offset: finalOffset,
        limit: finalLimit,
        order: finalOrder,
        ...(finalKeyword && { keyword: finalKeyword }),
      });
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
};

export default ProductController;
