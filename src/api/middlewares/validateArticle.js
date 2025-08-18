export default function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "제목을 입력하세요 (문자열)" });
  }

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "내용을 입력하세요 (문자열)" });
  }

  next();
}
