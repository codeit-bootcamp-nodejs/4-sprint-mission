
import prisma from "../lib/prisma.js";
import type { Request, Response, NextFunction } from 'express';


class ArticleMiddleware{
    ArticleValid = async (req: Request,res: Response,next: NextFunction) =>{
        const {title, articleContent} = req.body;
        if (!title ||!articleContent){
            res.send("no title or articleContent");
        }

        if (title.length>50 ||articleContent.length>800 ){
            res.send("too long or too short");
        }

        next();
    }

    ValidateId = async (req: Request,res: Response,next: NextFunction) => {
        const id = Number(req.params.id);

        if (!id){
            const err = new Error("invalid parameter")
            // err.status = 400;
            return next(err);
        }

        const Article = await prisma.article.findUnique({
            where: {id},
            include : {comment: true}
        });

        if (!Article){
            const err = new Error("No content")
            // err.status = 404
            return next(err);
        }

        next()
    }

    ValidateForm = async (req: Request,res: Response,next: NextFunction) => {
        const {title, articleContent} = req.body; 

        if (!title || !articleContent){
            const err = new Error("invalid body data");
            // err.status = 400;
            return next(err)
        }
        next();
    }

}
export default new ArticleMiddleware();