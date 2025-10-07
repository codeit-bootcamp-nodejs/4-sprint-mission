// validator
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) return next(result.error);

  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) return next(result.error);

  // req.query.data = result.data; read only
  next();
};

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) return next(result.error);

  //req.body = result.data; // attach refined data to requst body
  next();
};
