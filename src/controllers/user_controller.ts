import { Request, Response } from "express";
import {
  getUserByIdService,
  getUserService,
  getUserLikeService,
  updateUserService,
} from "../services/user_service";
import bcrypt from "bcrypt";
import { AppError } from "../utils/error";

interface UserParam {
  id?: string;
}

export async function getUserByIdController(
  req: Request<UserParam>,
  res: Response
) {
  try {
    const paramId = parseInt(req.params.id!);
    if (!req.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const userId = req.user.id;
    if (paramId !== userId)
      return res.status(403).json({ message: "권한이 없습니다." });

    const result = await getUserByIdService(userId);
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "서버 에러" });
    }
  }
}

export async function getUserController(req: Request, res: Response) {
  try {
    const result = await getUserService();
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "서버 에러" });
    }
  }
}

export async function getUserLikeController(
  req: Request<UserParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id!);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const userId = req.user!.id;
    if (id !== userId)
      return res.status(403).json({ message: "권한이 없습니다" });
    const result = await getUserLikeService(user);
    return res.status(201).json(result);
  } catch (e) {
    return res.json({ message: (e as Error).message });
  }
}

export async function updateUserController(
  req: Request<UserParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id!);
    if (!req.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const userId = req.user.id;
    if (id !== userId)
      return res.status(403).json({ message: "권한이 없습니다" });
    const { nickname, password } = req.body;
    const updateData: Users.Update["updateData"] = {};

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (nickname) updateData.nickname = nickname;
    if (password) updateData.password = hashedPassword;

    const result = await updateUserService({ id, updateData });
    return res.send(result);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "서버 에러" });
    }
  }
}
