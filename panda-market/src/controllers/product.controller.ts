import type { RequestHandler } from 'express';

import {
  hasId,
  hasIdAndUserId,
  hasParsedQuery,
  hasTokenPayload,
} from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import type { ProductService } from '@/services/product.service.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ProductLikeService } from '@/services/product-like.service.js';

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly productService: ProductService,
    @inject(TYPES.ProductLikeService)
    private readonly productLikeService: ProductLikeService,
  ) {}

  getProduct: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { id: productId } = req.parsedId;
    const { userId } = req.tokenPayload || {};
    const result = await this.productService.getProduct({ userId, productId });
    return res.status(200).json(result);
  };
  getProductList: RequestHandler = async (req, res) => {
    if (!hasParsedQuery(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload || {};
    const result = await this.productService.getProductList({
      userId,
      ...req.parsedQuery,
    });
    return res.status(200).json(result);
  };
  postProduct: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await this.productService.postProduct({
      userId,
      data,
    });
    return res.status(201).json(result);
  };
  patchProduct: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: productId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await this.productService.patchProduct({
      userId,
      productId,
      data,
    });
    return res.status(200).json(result);
  };
  deleteProduct: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: productId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.productService.deleteProduct({
      userId,
      productId,
    });
    return res.status(200).json(result);
  };
  postProductLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: productId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.productLikeService.postProductLike({
      userId,
      productId,
    });
    return res.status(201).json(result);
  };
  deleteProductLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: productId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.productLikeService.deleteProductLike({
      userId,
      productId,
    });
    return res.status(200).json(result);
  };
}
