import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '@/lib/constants.js';
import fs from 'fs';
import { BadRequestError, InternalServerError } from '@/lib/errors.js';

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
    console.log(`🗑️ Cloudinary에서 이미지 ${publicId} 삭제 성공`);
  } catch (err) {
    if (err instanceof Error) {
      // 타입 가드
      throw new InternalServerError(
        `❌ Cloudinary에서 이미지 ${publicId} 삭제 실패: ${err.message}`,
      );
    }
    throw new InternalServerError(
      `❌ Cloudinary에서 이미지 ${publicId} 삭제 중 알 수 없는 에러 발생: ${String(err)}`,
    );
  }
}

export function extractPublicIdFromCloudinaryUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    // 정규식 설명:
    // \/upload\/        : '/upload/' 문자열 찾기
    // (?:v\d+\/)?       : 'v123456/' 버전 번호가 있으면 무시 (?: non-capturing group)
    // (.+)              : [핵심] 나머지 경로(폴더+파일명)를 모두 캡처 (Group 1)
    // \.[^.]+$          : 맨 뒤의 확장자(.png 등) 제거
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;

    const match = url.pathname.match(regex);

    if (match && match[1]) {
      return match[1]; // 캡처된 Public ID 반환
    }
    throw new BadRequestError('publicId 매칭 실패');
  } catch {
    throw new BadRequestError('올바르지 않는 imageUrl 입니다');
  }
}
