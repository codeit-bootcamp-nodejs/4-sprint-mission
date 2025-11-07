import type {
  FindByEmailDTO,
  FindByProviderIdDTO,
  FindByIdDTO,
  UpdateDTO,
  CreateDTO,
} from '@/dto/auths.dto.js';
import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class AuthRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async findByEmail({ received_email }: FindByEmailDTO) {
    return await this.prisma.user.findUnique({
      where: { email: received_email },
    });
  }
  async findById({ tx, userId }: FindByIdDTO) {
    const db = tx || this.prisma;
    return await db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        refreshToken: true,
      },
    });
  }
  async findByProviderId({ tx, providerId }: FindByProviderIdDTO) {
    const db = tx || this.prisma;
    return await db.user.findUnique({
      where: {
        providerId,
      },
    });
  }
  async create({ tx, createData }: CreateDTO) {
    const db = tx || this.prisma;
    return await db.user.create({
      data: createData,
    });
  }

  async update({ tx, userId, refreshToken }: UpdateDTO) {
    const db = tx || this.prisma;
    return await db.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }
}
