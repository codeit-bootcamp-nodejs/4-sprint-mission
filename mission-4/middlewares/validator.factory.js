export default function createValidator(validateFn) {
  return (req, res, next) => {
    try {
      validateFn(req);
      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
