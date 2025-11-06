import type {
  findByEmailDTO,
  FindByIdDTO,
  SignupDTO,
  UpdateDTO,
} from '@/dto/auths.dto.js';
import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class AuthRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async create({ email, nickname, hashedPassword }: SignupDTO) {
    return await this.prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
  }
  async findByEmail({ received_email }: findByEmailDTO) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email: received_email },
    });
  }
  async update({ tx, userId, refreshToken }: UpdateDTO) {
    const client = tx || this.prisma;
    return await client.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }
  async findById({ tx, userId }: FindByIdDTO) {
    const client = tx || this.prisma;
    return await client.user.findUniqueOrThrow({
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
}
