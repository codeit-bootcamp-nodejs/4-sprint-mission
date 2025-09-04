import { signupSchema } from "../../validations/authSchema.js";

export default function authValidator() {
  return (req, res, next) => {
    try {
      switch (req.path) {
        case "/signup":
          signupSchema.parse(req.body);
          break;
        case "/login":
          signupSchema.partial().parse(req.body);
          break;
        default:
          const err = new Error("올바르지 않은 url입니다.");
          err.statusCode = 400;
          throw err;
      }
      next();
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: "유효성 검증 실패!", message: e });
    }
  };
}
