import type { Request, Response, NextFunction } from "express";
import {
  getProducts,
  createProduct,
  findProductById,
  updateProduct,
  removeProduct,
} from "../services/productService.js";

interface GetProductListQuery {
  offset?: string;
  limit?: string;
  name?: string;
  description?: string;
}

interface ProductId {
  id: string;
}

interface ProductBody {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export const getProductList = async (
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

    const products = await getProducts(
      offset,
      limit,
      name,
      description,
      userId
    );

    if (products.length === 0) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const postProduct = async (
  req: Request<{}, {}, ProductBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, tags } = req.body;
    const userId = Number(req.user!.id);

    const product = await createProduct(name, description, price, tags, userId);

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: Request<ProductId>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id || null;

    const product = await findProductById(id, userId!);

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const patchProduct = async (
  req: Request<ProductId, {}, ProductBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user!.id);

    const { name, description, price, tags } = req.body;

    const product = await updateProduct(
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
};

export const deletProduct = async (
  req: Request<ProductId>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user!.id);

    await removeProduct(id, userId);

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
