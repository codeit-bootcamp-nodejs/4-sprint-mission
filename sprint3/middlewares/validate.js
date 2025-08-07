export function validateProdCreate(req, res, next) {
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

export function validateArtCreate(req, res, next) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
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
