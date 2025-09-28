import type { RequestHandler } from 'express';
import {
  getCommentListService,
  postCommentService,
  patchCommentService,
  deleteCommentService,
} from '../services/commentService.js';
import {
  hasCursorQuery,
  hasIdAndUserId,
  hasParent,
  hasParentId,
  hasTokenPayload,
} from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
// prettier-ignore
class CommentController {
  getCommentList: RequestHandler = async (req, res) =>{
    if(!hasParent(req) || !hasCursorQuery(req)){
      throw new BadRequestError()
    }
    const parentType = req.parentType;
    const result = await getCommentListService({parentType, ...req.parsedCursorQuery});
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
    const result = await postCommentService({parentId, userId, parentType, content});
    return res.status(201).json(result);
  }
  patchComment: RequestHandler = async (req, res) =>{
    if(!hasIdAndUserId(req)){
      throw new BadRequestError();
    }
    const {content} = req.body;
    const {id: commentId} = req.parsedId;
    const {userId} = req.tokenPayload;
    const result = await patchCommentService({commentId, userId, content});
    return res.status(200).json(result);
  }
  deleteComment: RequestHandler = async (req, res) =>{
    if(!hasIdAndUserId(req)){
      throw new BadRequestError();
    }
    const {id: commentId} = req.parsedId;
    const {userId} = req.tokenPayload;
    const result = await deleteCommentService({commentId, userId});
    return res.status(200).json(result);
  }
}

export default new CommentController();
