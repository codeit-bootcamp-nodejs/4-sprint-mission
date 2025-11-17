import { ArticleController, ValidatedRequest } from "./article.controller";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { articleValidation } from "./article.validation";
import HttpError from "../lib/error";
import passport from "../auth/passport";

const router = express.Router();
const article_Controller = new ArticleController();

// 게시글 전체 조회 API
// validataion
// 에러 메시지 분리
// 키워드로 검색가능(content || title)
// 리퀘스트 쿼리값으로 페이지 네이션
router.get(
  "/",
  articleValidation.validateGetArticleList,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const { take, page, keyword } = req.validatedQuery!;
    //if(! keyword) throw new HttpError(400, "wrong")
    await article_Controller.getAticleListCont({ take, page, keyword }, res, next);
  }
);

// 해당  게시판 조회 API
// validataion
// 에러 메시지 분리
// 쿼리 파람에 특정 인덱스 가지고 와서 댓글과 생성자 포함한 게시판 조회
router.get(
  "/:id",
  articleValidation.validateArticleById,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const articleId = req.validatedParams!;
    console.log("articleId:",articleId)
    await  article_Controller.getArticleCont(articleId, res, next)
  }
);

// 게시판 생성
// validataion
// 에러 메시지 분리
// 리퀘스트 바디에서 <content,title> 가지고 오고 쿼리 값으로 user index값 가지고 오기
// todo: 로그인된 유저만 게시판 생성 가능
router.post(
  "/",
  passport.authenticate('access-token', { session: false }),
  articleValidation.validatCreateArticle,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
      const body = req.validatedBody;
      await article_Controller.createArticleCont(
        body,
        res,
        next
      );
  }
);

// 게시판 수정
// 쿼리 값으로 id를 가지고 와서 중복체크후 요청된 본문 내용 수정
// validataion
// 에러 메시지 분리
// todo: 댓글을 생성한 유저만 수정 가능
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  articleValidation.validateArticleById,
  articleValidation.validatCreateArticle,
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    console.log("데이터 들어옴")
    const body = req.validatedBody;
    const params = req.validatedParams!;
    await article_Controller.patchArticleCont(body, params, res, next);
  }
);

// 게시판 삭제
// validataion
// 에러 메시지 분리
// 쿼리 값으로 id를 가지고 와서 중복체크후 요청된 본문 내용 삭제
// todo: 댓글을 생성한 유저만 삭제 가능
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  articleValidation.validateArticleById,
  async (req:ValidatedRequest, res: Response, next: NextFunction) => {
    const params = req.validatedParams!;
    await article_Controller.poppedArticleCont(params, res, next);
  }
);

export default router;
function next(error: unknown) {
  throw new Error("Function not implemented.");
}
