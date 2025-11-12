import type { Request, Response, NextFunction } from "express";
import express from "express";
import { ArticleController } from "../controller/article.controller.js";
import {querySchema,paramsSchema,bodySchema} from"../validation/article.validation.js";
import { validateQuery,validateParam,validateBody} from "../middleware/validateMiddle.js";
import passport from "passport";
const router = express.Router()
const articleController = new ArticleController()

//모든 사람이 게시글을 조회 할수 있음

router.get("/",
    validateQuery(querySchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        await articleController.accessArticleList(req, res, next)    
})


router.get("/:id",
    validateParam(paramsSchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        await articleController.accessArticle(req, res, next)
})


//회원만 게시글 업로드/ 수정/ 삭제 가능
router.post("/",
    passport.authenticate("local",{session:false}),
    validateBody(bodySchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        await articleController.createArticle(req, res, next)
})


router.patch("/:id",
    passport.authenticate("local",{session:false}),
    validateParam(paramsSchema),
    validateBody(bodySchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        await articleController.modifyArticle(req, res, next)
})


router.delete("/:id",
    validateParam(paramsSchema),
    passport.authenticate("local",{session:false}),
    async(req:Request,res:Response,next:NextFunction)=>{
        await articleController.deleteArticle(req, res, next)
})

export default router