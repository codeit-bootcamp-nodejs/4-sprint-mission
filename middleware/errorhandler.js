import { HttpError } from "./error.js";

export function ErrorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).send({ message: "Internal Server Error" });
}
