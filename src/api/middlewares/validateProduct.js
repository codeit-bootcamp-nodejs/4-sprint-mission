export default function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ error: "상품 이름은 필수값입니다. (문자열)" });
  }

  if (!price || typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "상품 가격은 0보다 큰 숫자 (필수값)" });
  }

  next();
}
