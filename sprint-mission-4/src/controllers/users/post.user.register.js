import { hashPassword } from "../../../lib/password.js";
import prisma from "../../../lib/prisma.js";

export default async function createUser(req, res, next) {
  const { email, nickname, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        nickname: nickname,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "회원가입\n" + user });
  } catch (err) {
    next(err);
  }
}
