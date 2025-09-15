
import prisma from '../lib/prisma.js'
import type { Request, Response, NextFunction } from 'express';

interface User{
    id: number,
    password: string,
    image: string,
    email: string,

}


class LikeController{
    ArticleLike = async(req: Request,res: Response,next: NextFunction) => {
        const user = req.user
        let userId;
        if (user){
            userId = Number(user.id);
        }
        
        const articleId = Number(req.params.id);
        const like = await prisma.articleLike.create({
            data:{userId,articleId}
        })
        return like
    }

    ArticleDislike = async(req: Request,res: Response,next: NextFunction) => {
        const userId = Number(req.user.id);
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
        if (req.user){
            userId = Number(req.user.id);
        }
        
        const productId = Number(req.params.id);
        const like = await prisma.productLike.create({
            data:{userId,productId}
        })
        return like
    }

    ProductDislike = async(req: Request,res: Response,next: NextFunction) => {
        const userId = Number(req.user.id);
        const productId = Number(req.params.id);
        const findLike = await prisma.productLike.findFirst({
            where:{userId,productId}
        })
        await prisma.productLike.delete({
            where:{id: findLike.id}
        })
        return 'success'
    }
}

export default new LikeController();