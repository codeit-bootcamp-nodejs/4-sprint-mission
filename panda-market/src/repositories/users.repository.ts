import type { UpdateDTO } from '@/dto/users.dto.js';
import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class UserRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findById({ userId }: UserId) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        imagePublicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async findPasswordById({ userId }: UserId) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }

  async update({ userId, updateData }: UpdateDTO) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        imagePublicId: true,
        createdAt: true,
        updatedAt: true,
      },
      data: updateData,
    });
  }

  async delete({ userId }: UserId) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        imagePublicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
