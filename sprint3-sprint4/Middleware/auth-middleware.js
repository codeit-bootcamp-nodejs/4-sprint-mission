

import prisma from '../lib/prisma.js'


export function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }
}


export async function checkProductAuthorize(req,res,next){
        const sessionUser = req.user;
        const sessionUserId = sessionUser.id;
        const productId = req.params.id;
        const product =  await prisma.product.findUnique({
            where:{id:productId}
        })

        if (sessionUserId == product.userId){
            return next()
        }else{
            return res.status(401).send("권한이 없습니다")
        }
    }

export async function checkArticleAuthorize(req,res,next){
        const sessionUser = req.user;
        const sessionUserId = sessionUser.id;
        const articleId = req.params.id;
        const article = await prisma.article.findUnique({
            where:{id:articleId}
        })

        if (sessionUserId == article.userId){
            return next()
        }else{
            return res.status(401).send("권한이 없습니다")
        }
    }


