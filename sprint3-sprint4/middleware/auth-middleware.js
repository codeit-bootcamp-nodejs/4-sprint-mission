

import prisma from '../lib/prisma.js'


export function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }
}

export function checkAccessToken(req,res,next){

}

export async function checkProductAuthorize(req,res,next){
    const productId = Number(req.params.id);
    const user = req.user;
    const product = await prisma.product.findUnique({
        where:{id:productId}
    })
    if (product.userId==user.id){
        return next()
    }else{
        const error = new Error("401 unathorized")
        error.status = 401
        throw error
    }
}

export async function checkArticleAuthorize(req,res,next){
    const articleId = Number(req.params.id);
    const user = req.user;
    const article = await prisma.article.findUnique({
        where:{id:articleId}
    })
    if (article.userId==user.id){
        return next()
    }else{
        const error = new Error("401 unathorized")
        error.status = 401
        throw error
    }
}


export async function checkProductCommentAuthorize(req,res,next){
    const productId = Number(req.params.id);
    const user = req.user;
    const product = await prisma.product.findUnique({
        where:{id:productId}
    })
    if (product.userId==user.id){
        return next()
    }else{
        const error = new Error("401 unathorized")
        error.status = 401
        throw error
    }
}

