export const fileService = {
  processUploadedFile(file) {
    if (!file) {
      throw new Error('파일이 첨부되지 않았습니다.');
    }

    const { filename, originalname, mimetype } = file;
    const path = `/files/${filename}`;

    return {
      path,
      filename,
      originalname,
      mimetype,
    };
  },
};
