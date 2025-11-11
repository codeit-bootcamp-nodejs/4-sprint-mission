import type { RequestHandler } from 'express';
import { hasBuffer, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ImageService } from '@/services/image.service.js';

@injectable()
export class ImageController {
  constructor(
    @inject(TYPES.ImageService) private readonly imageService: ImageService,
  ) {}

  postImage: RequestHandler = async (req, res) => {
    if (!hasBuffer(req) || !hasTokenPayload(req)) {
      throw new BadRequestError('안녕 나다');
    }
    const { buffer } = req.file;
    const result = await this.imageService.postimage({ buffer });
    return res.status(201).json(result);
  };
}
