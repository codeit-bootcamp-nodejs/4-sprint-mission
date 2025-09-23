// src/middlewares/validate.js
/**
 * 요청 body / params / query 를 zod 스키마로 검증하는 공용 미들웨어
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({ message: 'ValidationError', issues: result.error.flatten() });
  }

  res.locals['validated'] = result.data; // { body, params, query }
  next();
};
