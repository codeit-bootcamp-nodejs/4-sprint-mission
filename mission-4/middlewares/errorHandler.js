export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "id를 찾을 수 없습니다." });
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
