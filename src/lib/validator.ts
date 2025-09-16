import createError from "http-errors";
import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export function makeValidator(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ body 검증 및 정제
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body ?? {});
        if (!result.success) {
          const err = createError(400, "요청 본문이 유효하지 않습니다.");
          (err as any).details = result.error.issues;
          throw err;
        }
        Object.defineProperty(req, "body", {
          value: result.data,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      } else {
        if (
          process.env.NODE_ENV !== "production" &&
          Object.keys(req.body ?? {}).length > 0
        ) {
          console.warn("[Validator] 허용되지 않은 body 값 무시됨");
        }
        Object.defineProperty(req, "body", {
          value: {},
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      // ✅ query 검증 및 정제
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query ?? {});
        if (!result.success) {
          const err = createError(400, "쿼리 파라미터가 유효하지 않습니다.");
          (err as any).details = result.error.issues;
          throw err;
        }
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      } else {
        if (
          process.env.NODE_ENV !== "production" &&
          Object.keys(req.query ?? {}).length > 0
        ) {
          console.warn("[Validator] 허용되지 않은 query 값 무시됨");
        }
        Object.defineProperty(req, "query", {
          value: {},
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      // ✅ params 검증 및 정제
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params ?? {});
        if (!result.success) {
          const err = createError(400, "경로 파라미터가 유효하지 않습니다.");
          (err as any).details = result.error.issues;
          throw err;
        }
        Object.defineProperty(req, "params", {
          value: result.data,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      } else {
        if (
          process.env.NODE_ENV !== "production" &&
          Object.keys(req.params ?? {}).length > 0
        ) {
          console.warn("[Validator] 허용되지 않은 params 값 무시됨");
        }
        Object.defineProperty(req, "params", {
          value: {},
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      return next();
    } catch (err: any) {
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
