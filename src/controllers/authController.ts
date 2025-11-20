import { Request, Response } from 'express';
import { create } from 'superstruct';
import { SignUpBodyStruct, SignInBodyStruct } from '../structs/authStructs';
import * as authService from '../services/authService';
import userResponseDTO from '../dto/userResponseDTO';

export async function signUp(req: Request, res: Response) {
  const { email, nickname, password } = create(req.body, SignUpBodyStruct);
  const { user, accessToken } = await authService.signUp(email, nickname, password);
  res.status(201).json({
    user: userResponseDTO(user),
    accessToken,
  });
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = create(req.body, SignInBodyStruct);
  const { user, accessToken } = await authService.signIn(email, password);
  res.status(200).json({
    user: userResponseDTO(user),
    accessToken,
  });
}
