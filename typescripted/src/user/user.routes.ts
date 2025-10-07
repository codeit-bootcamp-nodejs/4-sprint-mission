import Express from "express";
import type { Request, Response,NextFunction } from "express";
import {
  RequestUserBody,
  RequestUserParams,
  UserController,
} from "./user.controller";
import authRouter from "../auth/auth.routes";
import { UserValidation } from "./user.validation";
import { ValidatedRequest } from "../middleware/validateReq";

const router = Express.Router();
const usercontroller = new UserController();

router.use("/auth", authRouter);

// 유저 API
// 유저 정보 조회
// validataion && 에러 메시지 분리
//  디버깅
router.get(
  "/:id",
  UserValidation.validateUserAccessById,
  async (req: ValidatedRequest, res: Response, next:NextFunction) =>
    usercontroller.getUserInfoCont(req, res, next)
);

// 유저 회원 정보 수정
// validataion && 에러 메시지 분리
// todo : 로그인한 상태여야 
//  디버깅
router.patch(
  "/:id",
  UserValidation.validateUserAccessById,
  UserValidation.validateUpdateUser,
  async (req:ValidatedRequest, res: Response, next:NextFunction) =>
    usercontroller.patchUserCont(req, res, next)
);

// 유저 회원 비밀번호 수정
// validataion && 에러 메시지 분리
// todo : 로그인한 상태여야 
//  디버깅
router.patch(
  "/:id/password",
  UserValidation.validateUserAccessById,
  (req, res, next) => {
    console.log("After validateUserAccessById, req.body:", req.body);
    next();
  },
  UserValidation.validateUpdateUserPassword,
  (UserValidation.validateUpdateUserPassword, (req: ValidatedRequest, res, next) => {
    console.log("After validateUpdateUserPassword, req.validatedBody:", req.validatedBody);
    next();
  }),
  async (req:ValidatedRequest, res: Response, next:NextFunction) =>
    usercontroller.patchUserPassword(req, res, next)
);

//유저가 등록한 상품 리스트 조회
// validataion && 에러 메시지 분리
// todo:  디버깅

export default router;
