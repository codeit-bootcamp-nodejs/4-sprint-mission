import type { RequestHandler } from 'express';
import { deleteFileService, postFileService } from '../services/fileService.js';
import { hasFile, hasIdAndUserId, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';

class FileController {
  postFile: RequestHandler = async (req, res) => {
    if (!hasFile(req) || !hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { path } = req.file;
    const { userId } = req.tokenPayload;
    const result = await postFileService({ path, userId });
    return res.status(201).json(result);
  };
  deleteFile: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await deleteFileService({ id, userId });
    return res.status(200).json(result);
  };
}

export default new FileController();
