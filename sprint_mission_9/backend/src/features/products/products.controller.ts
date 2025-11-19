import { Response } from 'express';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from './products.dto';
import prisma from '../../shared/database/prisma.client';

const repository = new ProductsRepository(prisma);
const service = new ProductsService(repository);

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = GetProductsQueryDto.parse({
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      orderBy: req.query.orderBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string, 10) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string, 10) : undefined,
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags as string]) : undefined,
      search: req.query.search as string | undefined,
    });

    const result = await service.getProducts(query);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid query parameters', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    const product = await service.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const productData = CreateProductDto.parse({
      ...req.body,
      price: parseInt(req.body.price, 10),
      userId: req.userId,
    });

    const product = await service.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid product data', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    const updateData = UpdateProductDto.parse({
      ...req.body,
      price: req.body.price ? parseInt(req.body.price, 10) : undefined,
    });

    const product = await service.updateProduct(id, updateData, req.userId);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid product data', errors: error });
      return;
    }
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    await service.deleteProduct(id, req.userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    const result = await service.toggleLike(id, req.userId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};
