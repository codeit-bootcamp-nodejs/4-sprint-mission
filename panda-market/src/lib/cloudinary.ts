import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from './constants.js';
import fs from 'fs';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function cloudinaryUpload(path: string) {
  const result = await cloudinary.uploader.upload(path, {
    folder: 'mission8_files',
  });
  fs.unlinkSync(path);
  console.log('Cloudinary에 이미지 업로드 완료');
  return result;
}

export async function deleteCloudinaryFile(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
  } catch (err) {
    if (err instanceof Error) {
      // 타입 가드
      throw new Error(
        `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${err.message}`,
      );
    }
    throw new Error(
      `Cloudinary에서 이미지 ${publicId} 삭제 중 알 수 없는 에러 발생: ${String(err)}`,
    );
  }
}
