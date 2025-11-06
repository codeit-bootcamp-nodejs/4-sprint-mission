import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../services/products.service.js';
import { prisma } from '../utils/prisma.util.js';

export class ProductsController {
  productsService = new ProductsService();

  // 상품 등록
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, content } = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (!name || !content) {
        return res.status(400).json({ message: '상품명과 내용을 모두 입력해주세요.' });
      }

      const newProduct = await this.productsService.createProduct(name, content, userId);

      return res.status(201).json({ data: newProduct });
    } catch (err) {
      next(err);
    }
  };

  // 상품 목록 조회
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productsService.getProducts();

      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  // 상품 상세 조회
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const user = req.user;

      const product = await this.productsService.getProductById(+productId, user?.id);

      return res.status(200).json({ data: product });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  };

  // 상품 수정
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { name, content } = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      const updatedProduct = await this.productsService.updateProduct(+productId, userId, name, content);

      return res.status(200).json({ data: updatedProduct });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "ForbiddenError") {
        return res.status(403).json({ message: err.message });
      }
      if (err.name === "BadRequestError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  };

// 상품 삭제
deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;

    await this.productsService.deleteProduct(+productId, userId);

    return res.status(200).json({ message: "상품이 성공적으로 삭제 완료" });
  } catch (err: any) {
    if (err.name === "NotFoundError") {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

// 상품 좋아요/좋아요 취소
toggleProductLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = user.id;

    const result = await this.productsService.toggleProductLike(+productId, userId);

    return res.status(200).json(result);
  } catch (err: any) {
    if (err.name === "NotFoundError") {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};

// 특정 유저가 등록한 상품 목록 조회
getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const products = await this.productsService.getProductsByAuthor(user.id);
    return res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

// 내가 '좋아요' 누른 상품 목록 조회
getLikedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const likedProducts = await this.productsService.getLikedProducts(user.id);
    return res.status(200).json({ data: likedProducts });
  } catch (err) {
    next(err);
  }
};
}

