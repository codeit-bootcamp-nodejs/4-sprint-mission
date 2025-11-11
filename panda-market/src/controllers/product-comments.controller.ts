import type { RequestHandler } from 'express';
import {
  hasCursorQuery,
  hasIdAndUserId,
  hasParentId,
  hasTokenPayload,
} from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ProductCommentService } from '@/services/product-comment.service.js';

@injectable()
export class ProductCommentController {
  constructor(
    @inject(TYPES.ProductCommentService)
    private readonly productCommentService: ProductCommentService,
  ) {}

  getCommentList: RequestHandler = async (req, res) => {
    if (!hasCursorQuery(req) || !hasParentId(req)) {
      throw new BadRequestError();
    }
    const productId = req.parentId;
    const result = await this.productCommentService.getCommentList({
      productId,
      ...req.parsedCursorQuery,
    });
    return res.status(200).json(result);
  };
  postComment: RequestHandler = async (req, res) => {
    if (!hasParentId(req) || !hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { content } = req.body;
    const productId = req.parentId;
    const { userId } = req.tokenPayload;
    const result = await this.productCommentService.postComment({
      productId,
      userId,
      content,
    });
    return res.status(201).json(result);
  };
  patchComment: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { content } = req.body;
    const { id: commentId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.productCommentService.patchComment({
      commentId,
      userId,
      content,
    });
    return res.status(200).json(result);
  };
  deleteComment: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: commentId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.productCommentService.deleteComment({
      commentId,
      userId,
    });
    return res.status(200).json(result);
  };
}
