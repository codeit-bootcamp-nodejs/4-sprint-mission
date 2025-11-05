import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from './constants.js';
import fs from 'fs';
import { BadRequestError, InternalServerError } from './errors.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
// 파일 패스를 통해 업로드
export async function cloudinaryUpload(path: string) {
  const result = await cloudinary.uploader.upload(path, {
    folder: 'mission8_files',
  });
  fs.unlinkSync(path);
  console.log('Cloudinary에 이미지 업로드 완료');
  return result;
}
// 메모리 버퍼를 통해 스트림으로 업로드
export function cloudinaryStreamUpload(buffer: Buffer) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    // 업로드 스트림 생성
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mission8_files',
      },
      (error, result) => {
        if (error) {
          return reject(
            new InternalServerError(
              `Cloudinary 스트림 업로드 실패: ${error.message}`,
            ),
          );
        }
        if (result) {
          resolve(result);
        } else {
          reject(
            new InternalServerError('Cloudinary 업로드 후 result가 없습니다.'),
          );
        }
      },
    );

    // 버퍼를 스트림으로 변환하여 Cloudinary로 파이프
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
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

export function extractPublicIdFromCloudinaryUrl(imageUrl: string): string {
  try {
    const pivot = '/upload/';
    const uploadIndex = imageUrl.indexOf(pivot);

    if (uploadIndex === -1) {
      throw new BadRequestError('올바르지 않는 imageUrl 입니다');
    }

    let tail = imageUrl.slice(uploadIndex + pivot.length);
    const segments = tail.split('/');

    // v123456 형태의 버전 번호 제거
    if (segments[0].startsWith('v') && /^\d+$/.test(segments[0].slice(1))) {
      segments.shift();
    }

    // 변환 파라미터 제거 (예: c_fill,w_200 등)
    while (
      segments.length &&
      /[,_]/.test(segments[0]) &&
      !segments[0].includes('.')
    ) {
      segments.shift();
    }

    const joined = segments.join('/');
    const lastDotIndex = joined.lastIndexOf('.');

    return lastDotIndex > -1 ? joined.slice(0, lastDotIndex) : joined;
  } catch {
    throw new BadRequestError('올바르지 않는 imageUrl 입니다');
  }
}
