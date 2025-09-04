
import prisma from '../lib/prisma.js'

class LikeController{
    ArticleLike = async(req,res,next) => {
        const userId = req.user.id;
        const articleId = req.params.id;
        const like = await prisma.ArticleLike.create({
            data:{userId,articleId}
        })
        return like
    }

    ArticleDislike = async(req,res,next) => {
        const userId = req.user.id;
        const articleId = req.params.id;
        const findLike = await prisma.ArticleLike.findFirst({
            data:{userId,articleId}
        })
        await prisma.ArticleLike.delete({
            where:{id: findLike.id}
        })
        return 'success'
    }

    ProductLike = async(req,res,next) => {
        const userId = req.user.id;
        const productId = req.params.id;
        const like = await prisma.ProductLike.create({
            data:{userId,productId}
        })
        return like
    }

    ArticleDislike = async(req,res,next) => {
        const userId = req.user.id;
        const productId = req.params.id;
        const findLike = await prisma.ProductLike.findFirst({
            data:{userId,articleId}
        })
        await prisma.ProductLike.delete({
            where:{id: findLike.id}
        })
        return 'success'
    }
}

export default new LikeController();