import { contentSchema, patchSchema } from "../../validations/userSchema.js";

export default function userValidator() {
  return (req, res, next) => {
    try {
      // 추후 확장 고려
      switch (req.method) {
        case "GET":
          if (req.params.content) {
            const { content } = contentSchema.parse(req.params);
            req.content = content;
          }
          break;
        case "PATCH":
          patchSchema.partial().parse(req.body);
          break;
      }
      next();
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: "유효성 검증 실패!", message: e });
    }
  };
}
