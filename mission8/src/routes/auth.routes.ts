import express from "express";
import { AuthController } from "../controller/auth.controller.js"
import type { Request, Response, NextFunction } from "express";
import {authLoginSchema,authRegisterSchema,} from "../validation/auth.validation.js";
import {validateQuery, validateBody} from "../middleware/validateMiddle.js"
import passport from "passport";
const router = express.Router();
const ac = new AuthController()
// 로그인 API
router.get("/login",
    validateQuery(authLoginSchema),
    passport.authenticate("local",{session:false}),
    async(req: Request,res: Response,next : NextFunction) => {
        await ac.login(req, res, next)
    }
)


// 회원가입 API
router.post("/register",
    validateBody(authRegisterSchema),
    async(req: Request,res: Response,next : NextFunction) => {
       await ac.register(req, res, next)
    }
)


export default router;

