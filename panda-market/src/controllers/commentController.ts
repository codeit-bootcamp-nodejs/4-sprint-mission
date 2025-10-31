import type { RequestHandler } from 'express';
import { CommentService } from '@/services/commentService.js';
import {
  hasCursorQuery,
  hasIdAndUserId,
  hasParent,
  hasParentId,
  hasTokenPayload,
} from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

// prettier-ignore
@injectable()
export class CommentController {
  constructor(@inject(TYPES.CommentService) private readonly commentService: CommentService) {}

  getCommentList: RequestHandler = async (req, res) =>{
    if(!hasParent(req) || !hasCursorQuery(req)){
      throw new BadRequestError()
    }
    const parentType = req.parentType;
    const result = await this.commentService.getCommentList({parentType, ...req.parsedCursorQuery});
    return res.status(200).json(result);
  }
  postComment: RequestHandler = async (req, res) =>{
    if(!hasParentId(req) || !hasParent(req) || !hasTokenPayload(req)){
      throw new BadRequestError()
    }
    const {content} = req.body;
    const parentType = req.parentType;
    const parentId = req.parentId;
    const {userId} = req.tokenPayload;
    const result = await this.commentService.postComment({parentId, userId, parentType, content});
    return res.status(201).json(result);
  }
  patchComment: RequestHandler = async (req, res) =>{
    if(!hasIdAndUserId(req)){
      throw new BadRequestError();
    }
    const {content} = req.body;
    const {id: commentId} = req.parsedId;
    const {userId} = req.tokenPayload;
    const result = await this.commentService.patchComment({commentId, userId, content});
    return res.status(200).json(result);
  }
  deleteComment: RequestHandler = async (req, res) =>{
    if(!hasIdAndUserId(req)){
      throw new BadRequestError();
    }
    const {id: commentId} = req.parsedId;
    const {userId} = req.tokenPayload;
    const result = await this.commentService.deleteComment({commentId, userId});
    return res.status(200).json(result);
  }
}
