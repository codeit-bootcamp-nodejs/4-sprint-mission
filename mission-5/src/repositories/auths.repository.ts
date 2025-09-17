import prisma from '@lib/prisma.js';
import type { findByEmailDTO, FindByIdDTO, SignupDTO, UpdateDTO } from '@/dto/auths.dto.js';

class AuthRepository {
  async create({ email, nickname, hashedPassword }: SignupDTO) {
    return await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
  }
  async findByEmail({ received_email }: findByEmailDTO) {
    return await prisma.user.findUniqueOrThrow({
      where: { email: received_email },
    });
  }
  async update({ tx, userId, refreshToken }: UpdateDTO) {
    const client = tx || prisma;
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
    const client = tx || prisma;
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
export default new AuthRepository();
