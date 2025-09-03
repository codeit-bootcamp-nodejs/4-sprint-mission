import { imageSchema } from "../../validations/fileSchema.js";
import { idSchema } from "../../validations/commonSchema.js";

export default function fileValidator() {
  return (req, res, next) => {
    try {
      switch (req.method) {
        case "POST":
          imageSchema.parse(req.file);
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
