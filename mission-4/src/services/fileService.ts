import type { EntityId, UserId } from '@/types/shared.type.js';
import { cloudinaryUpload, deleteCloudinaryFile } from '../lib/cloudinary.js';
import prisma from '../lib/prisma.js';
import type { FileParams, PostImage } from '@/types/file.types.js';
import { ForbiddenError } from '@/lib/errors.js';

async function authorization({ userId, id }: EntityId & UserId): Promise<boolean> {
  const image = await prisma.image.findUniqueOrThrow({
    where: { id: id },
  });
  return image.userId === userId;
}

async function postFileService({ path, userId }: PostImage) {
  const result = await cloudinaryUpload(path);
  const newImage = await prisma.image.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      userId,
    },
    select: {
      url: true,
      id: true,
    },
  });
  return { id: newImage.id, imageUrl: newImage.url }; // prettier-ignore
}

async function deleteFileService({ id, userId }: FileParams) {
  if (await authorization({ userId, id })) {
    return await prisma.$transaction(async (tx) => {
      // 트랜잭션으로 묶어도 외부 api에 관련된 내용은 롤백 불가
      // 추가로 고민해봐야할 문제
      const imageToDelete = await tx.image.findUniqueOrThrow({
        where: { id },
      });
      await deleteCloudinaryFile(imageToDelete.publicId);
      await tx.image.delete({
        where: { id },
      });
      return imageToDelete;
    });
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}

export { postFileService, deleteFileService };
