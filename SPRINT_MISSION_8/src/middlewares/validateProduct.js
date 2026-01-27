export default function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: '이름은 문자열이어야 합니다.' });
  }

  if (!price || typeof price !== 'number') {
    return res.status(400).json({ message: '가격은 숫자여야 합니다.' });
  }

  next();
}
