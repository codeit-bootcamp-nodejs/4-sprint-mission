import { Request, Response } from 'express';
import { create } from 'superstruct';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs';
import * as usersService from '../services/usersService';
import * as authService from '../services/authService';
import userResponseDTO from '../dto/userResponseDTO';

export async function getMe(req: Request, res: Response) {
  const user = await usersService.getUser(req.user.id);
  res.send(userResponseDTO(user));
}

export async function updateMe(req: Request, res: Response) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = await usersService.updateUser(req.user.id, data);
  res.status(200).send(userResponseDTO(updatedUser));
}

export async function updateMyPassword(req: Request, res: Response) {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
  await authService.updateMyPassword(req.user.id, password, newPassword);
  res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyProductListParamsStruct);
  const { list, totalCount } = await usersService.getMyProductList(req.user.id, {
    page,
    pageSize,
    orderBy,
    keyword,
  });

  res.send({
    list,
    totalCount,
  });
}

export async function getMyFavoriteList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);
  const { list, totalCount } = await usersService.getMyFavoriteList(req.user.id, {
    page,
    pageSize,
    orderBy,
    keyword,
  });

  res.send({
    list,
    totalCount,
  });
}
