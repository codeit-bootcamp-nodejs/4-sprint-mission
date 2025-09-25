

import prisma from '../lib/prisma.js'
import type { Request, Response, NextFunction } from 'express';


interface User{
    id: number,
    password: string,
    image: string,
    email: string,
}


export function checkAuthenticated(req: Request,res: Response,next: NextFunction){
    if (req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }
}

// export function checkAccessToken(req: Request,res: Response,next: NextFunction){

// }

export async function checkProductAuthorize(req: Request,res: Response,next: NextFunction){
    const productId = Number(req.params.id);
    const user: any = req.user;
    
    const product = await prisma.product.findUnique({
        where:{id:productId}
    })
    if (product && user){
        if (product.userId==user.id){
            return next()
        }else{
            const error = new Error("401 unathorized")
            // error.status = 401
            throw error
        }
    }else{
        const error = new Error("no Product or user")
        // error.status = 401
        throw error
    }
}

export async function checkArticleAuthorize(req: Request,res: Response,next: NextFunction){
    const articleId = Number(req.params.id);
    const user:any = req.user;
    const article = await prisma.article.findUnique({
        where:{id:articleId}
    })
    if (article && user){
        if (article.userId==user.id){
            return next()
        }else{
            const error = new Error("401 unathorized")
            // error.status = 401
            throw error
        }
    }else{
        const error = new Error("no article or user")
        // error.status = 401
        throw error
    }
    
}


export async function checkArticleCommentAuth(req: Request,res: Response,next: NextFunction){
    const commentId = Number(req.params.commentId);
    const user:any = req.user
    const comment = await prisma.article.findUnique({
        where:{id:commentId}
    })
    const userId = Number(user.id);
    if (!comment){
        const error = new Error("no comment")
        // error.status = 401
        throw error
    }
    if (Number(comment.userId)===userId){
        return next()
    }else{
        const error = new Error("401 unathorized")
        // error.status = 401
        throw error
    }
}

export async function checkProductCommentAuth(req: Request,res: Response,next: NextFunction){
    const commentId = Number(req.params.commentId);
    const user:any = req.user
    const comment = await prisma.product.findUnique({
        where:{id:commentId}
    })
    const userId = Number(user.id);
    if (!comment){
        const error = new Error("no comment")
        // error.status = 401
        throw error
    }
    if (Number(comment.userId)===userId){
        return next()
    }else{
        const error = new Error("401 unathorized")
        // error.status = 401
        throw error
    }
}

export async function checkUserAuth(req: Request,res: Response,next: NextFunction){
    const paramId = Number(req.params.id);
    const user:any = req.user
    const userId = Number(user.id);
    if (paramId == userId){
        return next();
    }else{
        throw new Error("no auth")
    }
}