import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

export default validate;
