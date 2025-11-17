import { hashPassword } from "../../lib/password.js";
import prisma from "../../lib/prisma.js";
import type { Request, Response, NextFunction } from "express";

export default async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, nickname, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        nickname: nickname,
      },
    });

    res.status(201).json({ message: "회원가입\n" + user });
  } catch (err) {
    next(err);
  }
}
