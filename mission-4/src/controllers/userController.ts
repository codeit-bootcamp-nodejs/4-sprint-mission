import type { RequestHandler } from 'express';
import {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
  getUserContentLikeListService,
} from '../services/userService.js';
import type { JwtPayload } from 'jsonwebtoken';
import { hasContent, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError, UnauthorizedError } from '@/lib/errors.js';

class UserController {
  getUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId }: JwtPayload = req.tokenPayload;
    const result = await getUserService({ userId });
    return res.status(200).json(result);
  };
  patchUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await patchUserService({ userId, data });
    return res.status(200).json(result);
  };
  deleteUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await deleteUserService({ userId });
    return res.status(200).json(result);
  };
  getUserContentList: RequestHandler = async (req, res) => {
    if (!hasContent(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const content = req.content;
    const result = await getUserContentListService({ userId, content });
    return res.status(200).json(result);
  };
  getUserContentLikeList: RequestHandler = async (req, res) => {
    if (!hasContent(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const content = req.content;
    const result = await getUserContentLikeListService({ userId, content });
    return res.status(200).json(result);
  };
}

export default new UserController();
