import { ImageUploadResult } from '@/types/image.types.js';

export interface ImageUploadStrategy {
  upload(file: Express.Multer.File): Promise<ImageUploadResult>;
}
