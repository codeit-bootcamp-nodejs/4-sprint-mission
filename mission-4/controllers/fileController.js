import { deleteFileService, postFileService } from '../services/fileService.js';

class FileController {
  async postFile(req, res) {
    const { id: userId } = req.tokenPayload;
    const { path } = req.file;
    const result = await postFileService({ path, userId });
    return res.status(201).json(result);
  }
  async deleteFile(req, res) {
    const result = await deleteFileService({ id: req.parsedId });
    return res.status(200).json(result);
  }
}

export default new FileController();
