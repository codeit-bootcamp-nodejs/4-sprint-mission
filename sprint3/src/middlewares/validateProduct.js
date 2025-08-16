module.exports = (req, res, next) => {
  const { name, description, price, tags } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    !Array.isArray(tags)
  ) {
    return res.status(400).json({ message: '상품 필드 유효성 검사 실패' });
  }
  next();
};