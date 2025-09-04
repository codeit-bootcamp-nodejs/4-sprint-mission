import { postSchema } from "../../validations/articleSchema.js";
import { getListSchema, idSchema } from "../../validations/commonSchema.js";

export default function articleValidator() {
  return (req, res, next) => {
    try {
      switch (req.method) {
        case "GET":
          if (req.params.id) {
            req.parsedId = idSchema.parse(req.params);
          } else {
            req.parsedQuery = getListSchema.parse(req.query);
          }
          break;
        case "POST":
          postSchema.parse(req.body);
          break;
        case "PATCH":
          req.parsedId = idSchema.parse(req.params);
          postSchema.partial().parse(req.body);
          break;
        case "DELETE":
          req.parsedId = idSchema.parse(req.params);
          break;
        default:
          const err = new Error("올바르지 않은 요청 메소드입니다.");
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
