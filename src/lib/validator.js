import createError from "http-errors";

export function makeValidator(schemas) {
  return (req, res, next) => {
    try {
      const safe = {};

      // body 검증
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body ?? {});
        if (!result.success) {
          const err = createError(400, "요청 본문이 유효하지 않습니다.");
          err.details = result.error.issues;
          throw err;
        }
        safe.body = result.data;
        Object.defineProperty(req, "body", {
          value: safe.body,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      // query 검증
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query ?? {});
        if (!result.success) {
          const err = createError(400, "쿼리 파라미터가 유효하지 않습니다.");
          err.details = result.error.issues;
          throw err;
        }
        safe.query = result.data;
        Object.defineProperty(req, "query", {
          value: safe.query,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      // params 검증
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params ?? {});
        if (!result.success) {
          const err = createError(400, "경로 파라미터가 유효하지 않습니다.");
          err.details = result.error.issues;
          throw err;
        }
        safe.params = result.data;
        Object.defineProperty(req, "params", {
          value: safe.params,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      req.validated = safe;
      return next();
    } catch (err) {
      console.error("Validator error:", err);

      if (err.status) return next(err);

      if (err.errors || err.issues) {
        return next(
          createError(400, "요청 검증 실패", {
            details: err.errors || err.issues,
          })
        );
      }

      return next(createError(500, "검증 중 내부 오류가 발생했습니다."));
    }
  };
}
