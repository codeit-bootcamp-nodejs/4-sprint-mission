import type { RequestHandler } from 'express';

import type { JwtPayload } from 'jsonwebtoken';
import { hasTokenPayload } from '@/types/guard.js';
import { UnauthorizedError } from '@/lib/errors.js';
import type { UserService } from '@/services/user.service.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  getUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId }: JwtPayload = req.tokenPayload;
    const result = await this.userService.getUser({ userId });
    return res.status(200).json(result);
  };
  patchUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await this.userService.patchUser({ userId, data });
    return res.status(200).json(result);
  };
  deleteUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.deleteUser({ userId });
    return res.status(200).json(result);
  };
  getUserProductList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserProductList({
      userId,
    });
    return res.status(200).json(result);
  };
  getUserArticleList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserArticleList({
      userId,
    });
    return res.status(200).json(result);
  };
  getUserProductCommentList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserProductCommentList({
      userId,
    });
    return res.status(200).json(result);
  };
  getUserArticleCommentList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserArticleCommentList({
      userId,
    });
    return res.status(200).json(result);
  };
  getUserProductLikeList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserProductLikeList({
      userId,
    });
    return res.status(200).json(result);
  };
  getUserArticleLikeList: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await this.userService.getUserArticleLikeList({
      userId,
    });
    return res.status(200).json(result);
  };
}
