class Validation {
  validateId = (req, res, next) => {
    const paramValue = req.params.id;
    if (!paramValue || isNaN(parseInt(paramValue))) {
      return res.status(400).json({ message: '잘못된 ID 형식입니다.' });
    }
    next();
  };

  validateCommentId = (req, res, next) => {
    const paramValue = req.params.commentId;
    if (!paramValue || isNaN(parseInt(paramValue))) {
      return res.status(400).json({ message: '잘못된 댓글 ID 형식입니다.' });
    }
    next();
  };

  validateProductData = (req, res, next) => {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({
        message: '상품 이름, 설명, 가격은 필수 입력 항목입니다.',
      });
    }
    next();
  };

  validateArticleData = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: '제목, 내용을 기입하셨는지 확인해 주세요.',
      });
    }
    next();
  };

  validateCommentData = (req, res, next) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        message: '내용을 기입해 주세요.',
      });
    }
    next();
  };

  validateArticleUpdateData = (req, res, next) => {
    const { title, content, author } = req.body;
    if (!title && !content && !author) {
      return res.status(400).json({
        message:
          '수정할 데이터가 없습니다. (title, content, author 중 최소 하나 필요)',
      });
    }
    next();
  };

  validateProductUpdateData = (req, res, next) => {
    const { name, description, price, tags } = req.body;
    if (!name && !description && !price && !tags) {
      return res.status(400).json({
        message:
          '수정할 데이터가 없습니다. (name, description, price, tags 중 최소 하나 필요)',
      });
    }
    next();
  };
}

export const validation = new Validation();
