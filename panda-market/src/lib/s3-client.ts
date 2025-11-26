import { S3Client } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY } from '@/lib/constants.js';

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
