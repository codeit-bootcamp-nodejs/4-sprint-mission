export function validateProductCreate(req, res, next) {
  const { name, price, tags } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
      return res
        .status(400)
        .json({ error: "tags는 문자열 배열이여야 합니다." });
    }
  }
  next();
}

export function validateProductUpdate(req, res, next) {
  const { tags } = req.body;

  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
      return res
        .status(400)
        .json({ error: "tags는 문자열 배열이여야 합니다." });
    }
  }
  next();
}

export function validateProductQuery(req, res, next) {
  const allowedKeys = ["offset", "limit", "name", "description"];

  const queryKeys = Object.keys(req.query);

  for (const key of queryKeys) {
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ error: `잘못된 파라미터: ${key}` });
    }
  }

  const { name, description } = req.query;

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return res
      .status(400)
      .json({ error: "name은은 공백 없는 문자열이여야합니다." });
  }

  if (
    description !== undefined &&
    (typeof description !== "string" || description.trim() === "")
  ) {
    return res
      .status(400)
      .json({ error: "description는 공백 없는 문자열이여야합니다." });
  }

  next();
}

export function validateArticleCreate(req, res, next) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  next();
}

export function validateArticleQuery(req, res, next) {
  const allowedKeys = ["offset", "limit", "title", "content"];

  const queryKeys = Object.keys(req.query);

  for (const key of queryKeys) {
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ error: `잘못된 파라미터: ${key}` });
    }
  }

  const { title, content } = req.query;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res
      .status(400)
      .json({ error: "title은 공백 없는 문자열이여야합니다." });
  }

  if (
    content !== undefined &&
    (typeof content !== "string" || content.trim() === "")
  ) {
    return res
      .status(400)
      .json({ error: "content는 공백 없는 문자열이여야합니다." });
  }

  next();
}

export function validateNewComment(req, res, next) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "content는 필수입니다." });
  }

  next();
}

export function validateCommentUpdate(req, res, next) {
  const commentId = req.params.commentId ? Number(req.params.commentId) : null;
  const articleId = req.params.articleId ? Number(req.params.articleId) : null;
  const productId = req.params.productId ? Number(req.params.productId) : null;
  const { content } = req.body;

  if (isNaN(commentId) || !content) {
    return res.status(400).json({ error: "commentId와 content를 확인하세요." });
  }

  if (articleId !== null && isNaN(articleId)) {
    return res.status(400).json({ error: "잘못된 articleId 입니다." });
  }

  if (productId !== null && isNaN(productId)) {
    return res.status(400).json({ error: "잘못된 productId 입니다." });
  }
  next();
}

export function validateId(req, res, next) {
  const id = req.params.id ? Number(req.params.id) : null;
  const commentId = req.params.commentId ? Number(req.params.commentId) : null;
  const articleId = req.params.articleId ? Number(req.params.articleId) : null;
  const productId = req.params.productId ? Number(req.params.productId) : null;

  if (
    (id !== null && isNaN(id)) ||
    (commentId !== null && isNaN(commentId)) ||
    (articleId !== null && isNaN(articleId)) ||
    (productId !== null && isNaN(productId))
  ) {
    return res
      .status(400)
      .json({ error: "잘못된 ID 입니다. 숫자여야 합니다." });
  }
  next();
}
