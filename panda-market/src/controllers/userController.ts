import type { RequestHandler } from 'express';

import type { JwtPayload } from 'jsonwebtoken';
import { hasContent, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError, UnauthorizedError } from '@/lib/errors.js';
import type { UserService } from '@/services/userService.js';
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
  getUserContentList: RequestHandler = async (req, res) => {
    if (!hasContent(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const content = req.content;
    const result = await this.userService.getUserContentList({
      userId,
      content,
    });
    return res.status(200).json(result);
  };
  getUserContentLikeList: RequestHandler = async (req, res) => {
    if (!hasContent(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const content = req.content;
    const result = await this.userService.getUserContentLikeList({
      userId,
      content,
    });
    return res.status(200).json(result);
  };
}
