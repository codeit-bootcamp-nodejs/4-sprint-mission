import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_REGION } from './constants';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(buffer: Buffer, mimetype: string, originalname: string) {
  const ext = path.extname(originalname);
  const filename = `${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);

  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${filename}`;
}

export async function deleteFromS3(fileUrl: string) {
  const filename = fileUrl.split('/').pop();

  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: filename,
  });

  await s3Client.send(command);
}