export default function asyncHandler(func) {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
