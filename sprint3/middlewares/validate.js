export function validateProdCreate(req, res, next) {
  const { title, price, tags } = req.body;

  if (!title || !price) {
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

export function validateProdUpdate(req, res, next) {
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

export function validateProdQuery(req, res, next) {
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

export function validateArtCreate(req, res, next) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  next();
}

export function validateArtQuery(req, res, next) {
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

export function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "잘못된 ID 입니다. 숫자여야 합니다." });
  }

  next();
}
