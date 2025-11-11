import { cloudinaryStreamUpload } from '@/lib/cloudinary.js';
import { injectable } from 'inversify';
import { ImageParams } from '@/types/image.types.js';

@injectable()
export class ImageService {
  async postimage({ buffer }: ImageParams) {
    const { secure_url, public_id } = await cloudinaryStreamUpload(buffer);
    return { imageUrl: secure_url, public_id };
  }
}
