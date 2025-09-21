import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/service.container.js';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from '../dto/index.js';
import { AuthRequest } from '../types/auth.js';

interface AuthRequestExtended extends Request, AuthRequest {}

export const createProduct = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const { name, description, price, tags, imageUrl }: CreateProductDto =
      req.body;

    if (!name || !description || price === undefined || !Array.isArray(tags)) {
      res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
      return;
    }

    const productService = serviceContainer.getProductService();
    const product = await productService.createProduct({
      name,
      description,
      price,
      tags,
      userId: req.user.id,
      ...(imageUrl && { imageUrl }),
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(
      1,
      parseInt((req.query['page'] as string) ?? '1', 10) || 1,
    );
    const pageSize = Math.min(
      50,
      Math.max(
        1,
        parseInt((req.query['pageSize'] as string) ?? '10', 10) || 10,
      ),
    );
    const orderBy = req.query['orderBy'] as 'recent' | 'favorite' | undefined;
    const keyword = ((req.query['keyword'] as string) || '').trim();

    const query: ProductQueryDto = {
      page,
      pageSize,
      ...(orderBy && { orderBy }),
      ...(keyword && { keyword }),
    };

    const productService = serviceContainer.getProductService();
    const result = await productService.getProducts(query, req.user?.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params['id']!, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    const productService = serviceContainer.getProductService();
    const product = await productService.getProductById(id, req.user?.id);

    if (!product) {
      res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const id = parseInt(req.params['id']!, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    const updateData: UpdateProductDto = req.body;
    const productService = serviceContainer.getProductService();
    const updatedProduct = await productService.updateProduct(
      id,
      updateData,
      req.user.id,
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 상품을 수정할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteProduct = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const id = parseInt(req.params['id']!, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    const productService = serviceContainer.getProductService();
    await productService.deleteProduct(id, req.user.id);

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 상품을 삭제할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const toggleProductLike = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const productId = parseInt(req.params['id']!, 10);

    if (isNaN(productId)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    const productService = serviceContainer.getProductService();
    const result = await productService.toggleLike(productId, req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
