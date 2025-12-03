import { injectable } from 'inversify';
import { ImageUploadStrategy } from '@/strategies/image-upload-base.strategy.js';
import { ImageUploadResult } from '@/types/image.types.js';
import { cloudinaryStreamUpload } from '@/lib/cloudinary.js';

@injectable()
export class CloudinaryUploadStrategy implements ImageUploadStrategy {
  async upload(file: Express.Multer.File): Promise<ImageUploadResult> {
    const { secure_url, public_id } = await cloudinaryStreamUpload(file.buffer);
    return {
      imageUrl: secure_url,
      publicId: public_id,
    };
  }
}
