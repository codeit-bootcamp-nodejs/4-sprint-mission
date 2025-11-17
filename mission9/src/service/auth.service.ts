import type { RegisterDTO, LoginDTO } from "../dto/auth.dto.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/generate_token.js";
import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

export class AuthService {
  private prisma = prisma;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  private async findById<T extends Prisma.UserSelect>(id?: number, select?: T) {
    if (!id) throw new Error();
    return await prisma.user.findUnique({
      where: { id },
      select: select ?? null,
    });
  }

  private async findUser(email: string, nickname: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
  }
  async register({ email, password, nickname }: RegisterDTO) {
    const validateUser = await this.findUser(email, nickname);
    if (validateUser)
      throw new Error("이메일이나 nickname 중복 되어져 있습니다");
    const userPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        email,
        password: userPassword,
        nickname,
      },
    });

    return result;
  }

  async login(
    userId: number,
    { email, password }: LoginDTO
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findById(userId, {
      id: true,
      email: true,
      password: true,
    });
    if (!user) throw new Error("유저가 존재하지 않습니다");
    if (!user.password) throw new Error("비밀번호가 등록되지 않았습니다");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("비밀번호가 잘못 되었습니다.");
    // token 생성
    const { refreshToken, accessToken } = generateToken({ id: userId, email }); // 인증 미들웨어 부분 구현 하기
    const result = {
      refreshToken,
      accessToken,
    };
    return result;
  }

  /*
      private async findUserEmailDuplicate (email:string){
          const user = await prisma.user.findUnique({
              where:{ email }
          })

          if (user) throw new Error("해당 유저는 존재하지 않습니다")
          return user
      }


      private async findUserNicknameDuplicate (nickname :string){
          const user =  await prisma.user.findUnique({
              where:{ nickname }
          })

          if (user) throw new Error("이미 존재하는 닉네임 입니다")
          return user;
      }
  } 
  */
}
