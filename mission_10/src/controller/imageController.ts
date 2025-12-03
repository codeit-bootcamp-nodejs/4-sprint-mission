import type { Request, Response } from 'express';

class ImageController {
  uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const file = req.file as any;

    return res.status(201).json({
      message: '이미지 업로드 성공',
      file: {
        url: file.location,
        name: file.key,
      },
    });
  };
}

export const imageController = new ImageController();