import { Request, Response, NextFunction } from "express";

export class ImageController {
  uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new Error("이미지 파일이 필요합니다.");
      }

      // req.file.path는 이제 S3 URL입니다.
      res.status(201).json({
        message: "이미지가 성공적으로 업로드 및 리사이징되었습니다.",
        path: req.file.path, // S3 URL 반환
      });
    } catch (error) {
      next(error);
    }
  };
}
