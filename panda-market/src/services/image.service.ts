import { inject, injectable } from 'inversify';
import { S3UploadStrategy } from '@/strategies/s3-upload.strategy.js';
import { CloudinaryUploadStrategy } from '@/strategies/cloudinary-upload.strategy.js';
import { NODE_ENV } from '@/lib/constants.js';
import { TYPES } from '@/types/layer.types.js';
import { ImageUploadStrategy } from '@/strategies/image-upload-base.strategy.js';

@injectable()
export class ImageService {
  private uploadStrategy: ImageUploadStrategy;
  constructor(
    @inject(TYPES.S3UploadStrategy) private s3Strategy: S3UploadStrategy,
    @inject(TYPES.CloudinaryUploadStrategy)
    private cloudinaryStrategy: CloudinaryUploadStrategy,
  ) {
    this.uploadStrategy =
      NODE_ENV === 'production' ? this.s3Strategy : this.cloudinaryStrategy;
  }
  async postImage(file: Express.Multer.File) {
    return await this.uploadStrategy.upload(file);
  }
}
