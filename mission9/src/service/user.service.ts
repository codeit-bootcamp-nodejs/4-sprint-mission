  import prisma from "../lib/prisma.js";
  import { type Product, Prisma } from "@prisma/client";
  import type { IUserDTO, ChangePasswordDTO } from "../dto/user.dto.js";
  import bcrypt from "bcrypt";

  export class UserService {
    private async findUserById<T extends Prisma.UserSelect>(
      id: number,
      select?: T
    ) {
      return prisma.user.findUnique({
        where: { id },
        ...(select ? { select } : {}),
      });
    }

    private async findDuplicateNickname(nickname: string) {
      const result = await prisma.user.findUnique({
        where: { nickname },
      });
      if (result) throw new Error(" ");
    }

    async accessUserProducts(userId: number) {
      const validatedUser = await this.findUserById(userId, {
        id: true,
        nickname: true,
      });

      if (!validatedUser) throw new Error("존재 하지 않는 유저");
      const userProducts: Product[] = await prisma.product.findMany({
        where: { ownerId: userId },
        include: { owner: { select: { nickname: true } } },
      });

      return userProducts.map((p) => ({
        ...p,
        nickname: validatedUser?.nickname,
      }));
    }

    async accessUserInfo(userId: number) {
      const user = await this.findUserById(userId, {
        id: true,
        nickname: true,
      });

      if (!user) throw new Error("존재하지 않는 유저 입니다");

      return user;
    }

    async modifyUserInfo(user: IUserDTO) {
      const { id, email, nickname } = user;

      const validatedUser = await this.findUserById(id);
      if (!validatedUser) throw new Error("존재 하지 않는 유저 입니다");
      const result = await prisma.user.update({
        where: { id },
        data: {
          ...(nickname !== undefined && { nickname }),
          ...(email !== undefined && { email }),
        },
      });
      return result;
    }

    async modifyUserPassword(
      userId: number,
      { newPassword, currentPassword }: ChangePasswordDTO
    ) {
      const user = await this.findUserById(userId, {
        password: true,
      });
      if (!user || !user.password) throw new Error("유효하지 않는 유저입니다");

      const isCurrentPassword = await bcrypt.compare(currentPassword, user.password);
      if (isCurrentPassword) throw new Error("현재 비밀번호와 같은 비밀번호 입니다.");

      const isSameAsOld = await bcrypt.compare(newPassword, user.password)

      if (isSameAsOld) throw new Error("현재 비밀번호와 같은 비밀번호 입니다.")
      const hashPassword = await bcrypt.hash(newPassword, 10);

      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashPassword,
        },
      });
      return result;
    }
  }
