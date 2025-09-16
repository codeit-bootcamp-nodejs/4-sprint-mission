import prisma from "../lib/prisma";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
    });
  }

  async createUser(email: string, nickname: string, password: string) {
    return prisma.user.create({ data: { email, nickname, password } });
  }

  async updateUser(id: number, data: Partial<{ nickname: string; image: string; password: string }>) {
    return prisma.user.update({ where: { id }, data });
  }

  async findProductsByUserId(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      select: { name: true, description: true, price: true, tags: true },
    });
  }
}