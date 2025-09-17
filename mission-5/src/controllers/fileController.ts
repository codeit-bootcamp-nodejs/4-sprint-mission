import type { RequestHandler } from 'express';
import { hasFile, hasIdAndUserId, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import type { FileService } from '../services/fileService.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class FileController {
  constructor(@inject(TYPES.FileService) private readonly fileService: FileService) {}

  postFile: RequestHandler = async (req, res) => {
    if (!hasFile(req) || !hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { path } = req.file;
    const { userId } = req.tokenPayload;
    const result = await this.fileService.postFile({ path, userId });
    return res.status(201).json(result);
  };
  deleteFile: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.fileService.deleteFile({ id, userId });
    return res.status(200).json(result);
  };
}
