import type { Request, Response } from "express";

const ImageController = {
  uploadImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "이미지 파일 없음" });
    }

    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
  },
};

export default ImageController;
