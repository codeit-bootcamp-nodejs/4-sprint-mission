export default function errorHandler(err, req, res, next) {
  if (err?.name === "ZodError") {
    return res.status(400).json({ message: "Invalid input", issues: err.issues });
  }
  console.error(err);
  return res.status(500).json({ message: "Server error" });
}
