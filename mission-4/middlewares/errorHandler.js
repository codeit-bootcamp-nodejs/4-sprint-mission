export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "id를 찾을 수 없습니다." });
  } else if (err?.code === "P2002") {
    const model = err.meta?.modelName;
    let msg = "";
    if (model === "ProductLike") {
      msg = "이미 좋아요를 누른 상품입니다.";
    } else if (model === "ArticleLike") {
      msg = "이미 좋아요를 누른 게시글입니다.";
    } else if (model === "User") {
      msg = "이미 존재하는 유저입니다.";
    } else {
      msg = "데이터가 이미 존재합니다.";
    }
    return res.status(409).json({ error: msg });
  } else if (err?.code === "P2003") {
    return res.status(404).json({ error: "존재하지않는 관계 데이터입니다." });
  } else if (err?.name === "StructError") {
    return res.status(400).json({
      error: "Validation error",
      message: err.message,
    });
  } else if (err?.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "server error" });
  }
}
