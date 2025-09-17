import prisma from '@/lib/prisma.js';
import type { CreateDTO, DeleteDTO, findByIdDTO } from '@/dto/files.dto.js';

class FileRepository {
  async findById({ tx, id }: findByIdDTO) {
    const client = tx || prisma;
    return await client.image.findUniqueOrThrow({
      where: { id: id },
    });
  }
  async create({ secure_url, public_id, userId }: CreateDTO) {
    return await prisma.image.create({
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
    const client = tx || prisma;
    return client.image.delete({
      where: { id },
    });
  }
}
export default new FileRepository();
