import Express from "express";
import type { Request, Response , NextFunction} from "express";
import { AuthController, RequestUserBody } from "./auth.controller";
import passport from "./passport";

const router = Express.Router();
const authController = new AuthController();
//  에러 상태코드 분리// 수정
//  validation 파일 분리
// todo: 디버깅 
router.post(
  "/signup",

  async (req: Request<{}, {}, RequestUserBody, {}>, res: Response, next:NextFunction) =>
    authController.createUserCont(req, res,next)
);

//  에러 상태코드 분리// 수정
//  validation 파일 분리
// todo: 디버깅
router.post(
  "/login",
  async (req: Request<{}, {}, RequestUserBody, {}>, res: Response, next:NextFunction) =>
    authController.loginUserCont(req, res,next)
);

export default router;
