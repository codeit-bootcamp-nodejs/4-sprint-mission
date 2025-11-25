import {
  deleteCloudinaryFile,
  extractPublicIdFromCloudinaryUrl,
} from '@/lib/cloudinary.js';
import { deleteS3File, extractPublicIdFromS3Url } from '@/lib/s3-client.js';
import { v4 as uuidv4 } from 'uuid';
import { ImageUpdateQueryInput, ImageUtils } from '@/types/image.types.js';

export function getImageInfo(url: string) {
  if (url.includes('cloudinary.com')) {
    return {
      url,
      publicId: extractPublicIdFromCloudinaryUrl(url),
      storageType: 'cloudinary',
    };
  } else if (url.includes('amazonaws.com')) {
    return {
      url,
      publicId: extractPublicIdFromS3Url(url),
      storageType: 's3',
    };
  } else {
    return {
      url,
      publicId: uuidv4(),
      storageType: 'local',
    };
  }
}

export async function deleteImageFile({ publicId, storageType }: ImageUtils) {
  switch (storageType) {
    case 'cloudinary':
      await deleteCloudinaryFile(publicId);
      break;
    case 's3':
      await deleteS3File(publicId);
      break;
    default:
      break;
  }
}

export function buildUpdateImageQuery({
  images,
  newImages,
}: ImageUpdateQueryInput) {
  const imageSet = new Set(images.map((img) => img.publicId));
  const newImageList = newImages.map((imageUrl) => getImageInfo(imageUrl));
  const newImageIdSet = new Set(newImageList.map((info) => info.publicId));
  // 삭제할 이미지들
  const imagesToDelete = images
    .filter((img) => !newImageIdSet.has(img.publicId))
    .map((img) => {
      const info = getImageInfo(img.url);
      return {
        publicId: info.publicId,
        storageType: info.storageType,
      };
    });
  // 새로 생성할 이미지들
  const imagesToCreate = newImageList.filter(
    (info) => !imageSet.has(info.publicId),
  );
  return {
    imagesToDelete,
    query: {
      deleteMany: imagesToDelete.map(({ publicId }) => ({ publicId })),
      create: imagesToCreate.map((info) => ({
        url: info.url,
        publicId: info.publicId,
      })),
    },
  };
}
