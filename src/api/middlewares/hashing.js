import bcrypt from "bcrypt";

export default function hassingPassword() {
  return async (req, res, next) => {
    const { password } = req.body;

    if (!password) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      req.body.password = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  };
}
