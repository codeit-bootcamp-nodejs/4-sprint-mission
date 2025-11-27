import express, { Response } from 'express';
import * as productService from '../services/productService';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page, pageSize, keyword, sortBy } = req.query;
    const products = await productService.getProducts({
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      keyword: keyword as string,
      sortBy: sortBy as string,
    });
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productService.getProductById(id);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

// Protected routes
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || price === undefined || !tags) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await productService.createProduct({
      name,
      description,
      price,
      tags,
      userId: req.userId!,
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, tags } = req.body;

    const product = await productService.updateProduct(id, req.userId!, {
      name,
      description,
      price,
      tags,
    });
    res.status(200).json(product);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : error.message.includes('not authorized') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await productService.deleteProduct(id, req.userId!);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : error.message.includes('not authorized') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

export default router;
