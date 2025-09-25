import multer from "multer";
import express from 'express';
import prisma from '../lib/prisma'
import type { Request, Response, NextFunction } from 'express';

export function ProductValid(req: Request,res: Response,next: NextFunction){
    const {name,description, price, tags} = req.body;
    try{
        if (typeof(name) =='undefined' || typeof(description) =='undefined'||
            typeof(price) == 'undefined' || typeof(tags)=='undefined'){
                throw Error;
        }else{
            next();
        }
    } catch(error){
        return res.status(400).send("400 bad request");
    }
}

export class ProductMiddleware{
    validateId = async(req: Request,res: Response,next: NextFunction) => {
        const id = Number(req.params.id);
        if (!id){
            const err = new Error("invalid parameter")
            // err.status = 400;
            return next(err);
        }
    
        const Product = await prisma.product.findUnique({
            where:{id},
            include: {comment:true}
        });
        if (!Product){
            const err = new Error("No content")
            // err.status = 404;
            return next(err);
        }

        next()
    }

    validateForm = async(req: Request,res: Response,next: NextFunction) => {
        const {name,description, price, tags} = req.body;
        if (!name|| !description ||!price || !tags){
            const err = new Error("invalid body data");
            // err.status = 400;
            return next(err)
        }
        next()
    }
    
    validateCommentId = async(req: Request,res: Response,next: NextFunction) => {
        const CommentId = Number(req.params.commentId);
        if (!CommentId){
            const err = new Error("invalid parameter")
            // err.status = 400;
            return next(err);
        }
        next()
    }

}
export default new ProductMiddleware();