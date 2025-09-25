
import prisma from '../lib/prisma.js'
import type { Request, Response, NextFunction } from 'express';

class LikeController{
    ArticleLike = async(req: Request,res: Response,next: NextFunction) => {
        const user:any = req.user
        let userId;
        userId = Number(user.id);
        if (!user){
            throw Error("no user");
        }
        
        const articleId = Number(req.params.id);
        const like = await prisma.articleLike.create({
            data:{userId,articleId}
        })
        return like
    }

    ArticleDislike = async(req: Request,res: Response,next: NextFunction) => {
        const user:any = req.user;
        const userId = Number(user.id);
        const articleId = Number(req.params.id);
        const findedLike = await prisma.articleLike.findFirst({
            where:{userId,articleId}
        })
        if (findedLike){
            await prisma.articleLike.delete({
                where:{id: findedLike.id}
            })
        }
        
        return 'success'
    }

    ProductLike = async(req: Request,res: Response,next: NextFunction) => {
        let userId;
        const user:any = req.user;
        if (req.user){
            userId = Number(user.id);
        }
        
        const productId = Number(req.params.id);
        const like = await prisma.productLike.create({
            data:{
                user:{connect:{id: userId}},
                product:{connect:{id:productId}}}
        })
        return like
    }

    ProductDislike = async(req: Request,res: Response,next: NextFunction) => {
        const user:any = req.user;
        const userId = Number(user.id);
        const productId = Number(req.params.id);
        const findLike = await prisma.productLike.findFirst({
            where:{userId,productId}
        })
        if (!findLike){
            throw Error("there isn't like")
        }
        await prisma.productLike.delete({
            where:{id: findLike.id}
        })
        return 'success'
    }
}

export default new LikeController();