import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../services/products.service.js';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto.js';
import { ProductsRepository } from '../repositories/products.repository.js';
import { BadRequestError, UnauthorizedError } from '../errors/http-error.js';

export class ProductsController {
  productsService: ProductsService;
  productsRepository: ProductsRepository;

  constructor() {
    this.productsRepository = new ProductsRepository();
    this.productsService = new ProductsService(this.productsRepository);
  }

  // 상품 등록
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createProductDto: CreateProductDto = req.body;
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      if (!createProductDto.name || !createProductDto.content) {
        throw new BadRequestError('상품명과 내용을 모두 입력해주세요.');
      }

      const newProduct = await this.productsService.createProduct(
        createProductDto,
        userId,
      );

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

      const product = await this.productsService.getProductById(
        +productId,
        user?.id,
      );

      return res.status(200).json({ data: product });
    } catch (err) {
      next(err);
    }
  };

  // 상품 수정
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const updateProductDto: UpdateProductDto = req.body;
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      const updatedProduct = await this.productsService.updateProduct(
        +productId,
        userId,
        updateProductDto,
      );

      return res.status(200).json({ data: updatedProduct });
    } catch (err) {
      next(err);
    }
  };

  // 상품 삭제
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      await this.productsService.deleteProduct(+productId, userId);

      return res.status(200).json({ message: '상품이 성공적으로 삭제 완료' });
    } catch (err) {
      next(err);
    }
  };

  // 상품 좋아요/좋아요 취소
  toggleProductLike = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      const result = await this.productsService.toggleProductLike(
        +productId,
        userId,
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // 특정 유저가 등록한 상품 목록 조회
  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const products = await this.productsService.getProductsByAuthor(user.id);
      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  // 내가 '좋아요' 누른 상품 목록 조회
  getLikedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const likedProducts = await this.productsService.getLikedProducts(
        user.id,
      );
      return res.status(200).json({ data: likedProducts });
    } catch (err) {
      next(err);
    }
  };
}