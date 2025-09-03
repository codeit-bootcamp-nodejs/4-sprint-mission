import multer from "multer";
import express from 'express';


export function ProductValid(req,res,next){
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
    validateId = async(req,res,next) => {
        const id = number(req.params.id);
        if (!id){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }
    
        const Product = await prisma.product.findUnique({
            where:{id},
            include: {comment:true}
        });
        if (!product){
            const err = new Error("No content")
            err.status = 404;
            return next(err);
        }

        next()
    }

    validateForm = async(req,res,next) => {
        const {name,description, price, tags} = req.body;
        if (!name|| !description ||!price || !tags){
            const err = new Error("invalid body data");
            err.status = 400;
            return next(err)
        }
        next()
    }
    
    validateCommentId = async(req,res,next) => {
        const CommentId = Number(req.params.commentId);
        if (!CommentId){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }
        next()
    }

}
export default new ProductMiddleware();