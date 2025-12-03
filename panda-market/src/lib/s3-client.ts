import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  AWS_ACCESS_KEY,
  AWS_BUCKET,
  AWS_REGION,
  AWS_SECRET_KEY,
} from '@/lib/constants.js';
import { InternalServerError } from '@/lib/errors.js';

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION ?? '',
      credentials: {
        accessKeyId: AWS_ACCESS_KEY ?? '',
        secretAccessKey: AWS_SECRET_KEY ?? '',
      },
    });
  }
  return s3Client;
}

export function extractPublicIdFromS3Url(imageUrl: string) {
  const urlObj = new URL(imageUrl);
  const key = urlObj.pathname.slice(1);
  return decodeURIComponent(key);
}

export async function deleteS3File(key: string) {
  try {
    const s3Client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    console.log(`🗑️ [S3] 삭제 완료: ${key}`);
  } catch (e) {
    console.error(e);
    throw new InternalServerError(`❌ S3에서 이미지 ${key} 삭제 실패`);
  }
}
