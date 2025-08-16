module.exports = (req, res, next) => {
  const { title, content } = req.body;
  if (
    typeof title !== 'string' ||
    typeof content !== 'string'
  ) {
    return res.status(400).json({ message: '게시글 필드 유효성 검사 실패' });
  }
  next();
};