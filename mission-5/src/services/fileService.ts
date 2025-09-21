import type { EntityId, UserId } from '@/types/shared.type.js';
import { cloudinaryUpload, deleteCloudinaryFile } from '../lib/cloudinary.js';
import prisma from '../lib/prisma.js';
import type { FileParams, PostImage } from '@/types/file.types.js';
import { ForbiddenError } from '@/lib/errors.js';
import type { FileRepository } from '@/repositories/files.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class FileService {
  constructor(@inject(TYPES.FileRepository) private readonly fileRepository: FileRepository) {}

  async authorization({ userId, id }: EntityId & UserId): Promise<boolean> {
    const image = await this.fileRepository.findById({ id });
    return image.userId === userId;
  }

  async postFile({ path, userId }: PostImage) {
    const { secure_url, public_id } = await cloudinaryUpload(path);
    const newImage = await this.fileRepository.create({ secure_url, public_id, userId });
    return { id: newImage.id, imageUrl: newImage.url }; // prettier-ignore
  }

  async deleteFile({ id, userId }: FileParams) {
    if (await this.authorization({ userId, id })) {
      return await prisma.$transaction(async (tx) => {
        // 트랜잭션으로 묶어도 외부 api에 관련된 내용은 롤백 불가
        // 추가로 고민해봐야할 문제
        const imageToDelete = await this.fileRepository.findById({ tx, id });
        await deleteCloudinaryFile(imageToDelete.publicId);
        await this.fileRepository.delete({ tx, id });
        return imageToDelete;
      });
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
