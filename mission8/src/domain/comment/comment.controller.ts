import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { postRepository } from '../post/post.repository.js';
import { commentService } from './comment.service.js';

class CommentController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }

      const userId = req.user.id;
      const postId = Number(req.params['postId']);
      const content = req.body.content;

      const post = await postRepository.findById(postId);
      if (!post) {
        throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.postNotFound);
      }

      const createCommentData = { content, userId, postId };
      const result = await commentService.create(createCommentData);

      res.status(STATUS_CODE.OK).json(result);
    } catch (err) {
      return next(err);
    }
  };
}

export const commentController = new CommentController();
