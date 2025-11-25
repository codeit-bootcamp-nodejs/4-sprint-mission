export const ImageType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface CloudinaryParams {
  buffer: Buffer;
}

export interface S3Params {
  location: string;
  key: string;
}

export interface ImageUtils {
  publicId: string;
  storageType: string;
}

export interface ImageUpdateQueryInput {
  images: {
    publicId: string;
    url: string;
  }[];
  newImages: string[];
}
