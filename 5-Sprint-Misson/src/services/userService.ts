import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
  async getProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: number, data: { nickname?: string; image?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("유저 없음");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("기존 비밀번호 불일치");

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: "비밀번호 변경 완료" };
  }

  async getMyProducts(userId: number, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true },
      }),
      prisma.product.count({ where: { userId } }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
