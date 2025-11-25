import { cloudinaryStreamUpload } from '@/lib/cloudinary.js';
import { injectable } from 'inversify';
import { CloudinaryParams, S3Params } from '@/types/image.types.js';

@injectable()
export class ImageService {
  async postImageToCloudinary({ buffer }: CloudinaryParams) {
    const { secure_url, public_id } = await cloudinaryStreamUpload(buffer);
    return { imageUrl: secure_url, public_id };
  }
  async postImageToS3({ location, key }: S3Params) {
    return { imageUrl: location, publicId: key };
  }
}
