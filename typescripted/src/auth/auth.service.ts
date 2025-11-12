import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../lib/constants";

export interface IAuthUser {
  nickname: string | null;
  password?: string;
  email: string | null;
}

export class AuthService {
  async createUser(input: {
    nickname: string;
    password: string;
    email: string;
  }): Promise<IAuthUser> {
    const { nickname, password, email } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
        email,
      },
      select: {
        nickname: true,
        email: true,
      },
    });
    return newUser;
  }

  async loginUser(input: {
    nickname: string;
    password: string;
    email: string;
  }): Promise<void> {
    const { nickname, password, email } = input;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { nickname: nickname }],
      },
    });
    if (!user) throw { status: 404, message: "not found" };

    // user.password null 체크
    if (!user.password)
      throw { status: 400, message: "비밀번호가 설정되지 않았습니다." };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 400, message: "비밀번호 확인" };
  }

  generateToken(userId: number) {
    const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "30mins",
    });
    const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  }
  verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
  }
  verifyRefreshToken(token: string) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
  }
}
