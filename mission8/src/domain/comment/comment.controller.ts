import type { NextFunction, Request, Response } from 'express';

import { STATUS_CODE } from '../../constants/constant.js';
import { postRepository } from '../post/post.repository.js';
import { commentService } from './comment.service.js';

class CommentController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
          message: 'Unauthorized',
        });
      }

      const userId = Number(req.user.id);
      const postId = Number(req.params['postId']);
      const content = req.body.comment;

      const post = await postRepository.findById(postId);
      if (!post) {
        return res.status(111);
      }

      const data = { content, userId, postId };
      const result = await commentService.create(data);

      res.status(STATUS_CODE.SUCCESS).json(result);
    } catch (err) {
      return next(err);
    }
  };
}

export const commentController = new CommentController();
