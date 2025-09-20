import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../service/product-service';
import { LikeService } from '../service/like-service';

export class ProductController {
  productService: ProductService;
  likeService: LikeService;

  constructor(productService: ProductService, likeService: LikeService) {
    this.productService = productService;
    this.likeService = likeService;
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { name, description, price, tags } = req.body;
      const newProduct = await this.productService.createProduct(
        userId,
        name,
        description,
        price,
        tags,
      );
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');
      const search = req.query.search as string;
      const userId = (req as any).user?.id;
      const result = await this.productService.getProducts(
        page,
        limit,
        search,
        userId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const result = await this.productService.getProductById(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = await this.productService.updateProduct(
        userId,
        id,
        productData,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id } = req.params;
      await this.productService.deleteProduct(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id: productId } = req.params;
      const result = await this.likeService.toggleProductLike(
        userId,
        parseInt(productId),
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}