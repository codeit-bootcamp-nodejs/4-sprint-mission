import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, '상품 이름을 입력해주세요.'),
  description: z.string().min(1, '상품 설명을 입력해주세요.'),
  price: z.number().nonnegative('가격은 0 이상이어야 합니다.'),
  tags: z.string().min(1, '태그를 입력해주세요.'),
});

function productValidation(req, res, next) {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  next();
}
export default productValidation;
