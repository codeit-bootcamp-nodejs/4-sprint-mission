
import prisma from '../lib/prisma.js'

interface articleLikeInput{
    userId:number,
    articleId:number
}

interface articleDislikeInput{
    findedLike
}

interface productLikeInput{
    userId:number,
    productId:number
}

interface productDislikeInput{
    findedLike
}


export default class likeRepository{
    likeArticle = async({userId,articleId}:articleLikeInput) =>{
        const like = await prisma.articleLike.create({
                    data:{userId,articleId}
            })
        return like
    }

    dislikeArticle = async(findedLike:articleDislikeInput) =>{
        await prisma.articleLike.delete({
                        where:{id: findedLike.id}
                    })
    }

    likeProduct = async({userId, productId}:productLikeInput) =>{
        const like = await prisma.productLike.create({
                    data:{
                        user:{connect:{id: userId}},
                        product:{connect:{id:productId}}}
                })
        return like
    }

    dislikeProduct = async(findedLike:productDislikeInput) =>{
        await prisma.productLike.delete({
                    where:{id: findedLike.id}
                })
    }

}