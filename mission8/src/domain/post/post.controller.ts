import type { NextFunction, Request, Response } from 'express';

import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { postService } from './post.service.js';
import { createDataInput } from './post.type.js';

class PostController {
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = Number(req.params['postId']);
      const postData = await postService.getById(postId);
      res.status(STATUS_CODE.OK).json(postData);
    } catch (err) {
      next(err);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.userNotFound));
      }

      const createPostInput: createDataInput = {
        content: req.body.content,
        title: req.body.title,
        userId: req.user.id,
      };

      const post = await postService.create(createPostInput);
      res.status(STATUS_CODE.CREATED).json(post);
    } catch (err) {
      next(err);
    }
  };
}
export const postController = new PostController();
