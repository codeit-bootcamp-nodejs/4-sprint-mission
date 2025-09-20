export class ImageController {
  uploadImage = (req, res, next) => {
    try {
      if (!req.file) {
        throw new Error('이미지 파일이 필요합니다.');
      }

      res.status(201).json({
        message: '이미지가 성공적으로 업로드 및 리사이징되었습니다.',
        path: req.file.path,
      });
    } catch (error) {
      next(error);
    }
  };
}
