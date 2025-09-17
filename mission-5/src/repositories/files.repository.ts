import type { CreateDTO, DeleteDTO, findByIdDTO } from '@/dto/files.dto.js';
import type { PrismaClient } from '@prisma/client';

export class FileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById({ tx, id }: findByIdDTO) {
    const client = tx || this.prisma;
    return await client.image.findUniqueOrThrow({
      where: { id: id },
    });
  }
  async create({ secure_url, public_id, userId }: CreateDTO) {
    return await this.prisma.image.create({
      data: {
        url: secure_url,
        publicId: public_id,
        userId,
      },
      select: {
        url: true,
        id: true,
      },
    });
  }
  async delete({ tx, id }: DeleteDTO) {
    const client = tx || this.prisma;
    return client.image.delete({
      where: { id },
    });
  }
}
