import { injectable } from 'inversify';
import { ImageUploadStrategy } from './image-upload-base.strategy.js';

@injectable()
export class S3UploadStrategy implements ImageUploadStrategy {
  async upload(file: Express.Multer.File) {
    const { location, key } = file;
    return {
      imageUrl: location,
      publicId: key,
    };
  }
}
