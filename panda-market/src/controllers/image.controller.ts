import type { RequestHandler } from 'express';
import { hasFile, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ImageService } from '@/services/image.service.js';
import { NODE_ENV } from '@/lib/constants.js';

@injectable()
export class ImageController {
  constructor(
    @inject(TYPES.ImageService) private readonly imageService: ImageService,
  ) {}

  postImage: RequestHandler = async (req, res) => {
    if (!hasFile(req) || !hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    if (NODE_ENV === 'production') {
      const { location, key } = req.file;
      const result = await this.imageService.postImageToS3({ location, key });
      return res.status(201).json(result);
    } else {
      const { buffer } = req.file;
      const result = await this.imageService.postImageToCloudinary({ buffer });
      return res.status(201).json(result);
    }
  };
}
