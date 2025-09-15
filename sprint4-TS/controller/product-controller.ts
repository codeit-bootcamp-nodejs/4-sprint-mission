
import productService from '../service/product-service';
import prisma from '../lib/prisma'
import type { Request, Response, NextFunction } from 'express';

export class ProductController{
    getProducts = async (req: Request,res: Response,next: NextFunction) =>{
        let {sort = 'recent', skip = 0, take= 10, searchName, searchDescription} = req.query;
        
        const data = {sort, skip, take, searchName, searchDescription};
        try{
            let user = req.user;
            let products = await productService.getProducts(data);
            
            for (let product of products){
                product = await productService.addIsLiked(user,product);
            }

            return res.status(200).send(products);
            
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
            
        }
    }

    getOneProduct = async (req: Request,res: Response,next: NextFunction) =>{
        const id = Number(req.params.id);
    
        try{
            const user = req.user;
            let product = await prisma.product.findUnique({
                where:{id},
                include: {comment:true}
            });
            product = await productService.addIsLiked(user, product);
            return res.status(200).send(product);
            
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    postProduct = async (req: Request,res: Response,next: NextFunction) =>{
        const {name,description, price, tags} = req.body;

        try{
            const Product = await prisma.product.create({
                data:{
                    name,
                    description,
                    price,
                    tags,
                }
            });
            console.log("post success");
            return res.status(201).send(Product);
            
        }catch(error){
            console.log('post product failed because of server error');
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }


    patchProduct = async (req: Request,res: Response,next: NextFunction) =>{
        const {name, description, price, tags} = req.body;
        const id = Number(req.params.id) ;

        try{
            const product= await prisma.product.update({
                where: {id},
                data: {
                    name,
                    description,
                    price,
                    tags
                }
            });
            console.log("patch success");
            return res.status(200).send(product);
            
        }catch(error){
            console.log('patch product failed because of server error');
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    deleteProduct = async (req: Request,res: Response,next: NextFunction) =>{
        const id = Number(req.params.id) ;
        try{
            await prisma.product.delete({
                where:{id}
            });
            console.log("deleting success");
            return res.status(204).send("deleting successed");
            
        }catch(error){
            console.log('deleting product failed because of server error');
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    getComments = async (req: Request,res: Response,next: NextFunction) =>{
        try{
            let {take = 10,skip= 1,commentId = 1} = req.query;
            take = Number(take);
            skip = Number(skip);
            commentId = Number(commentId);

            const comments= await prisma.productComment.findMany({
                take,
                skip,
                cursor: {id: commentId},
                orderBy:{id: 'asc'}
            });
            
            if (!comments){
                return res.status(300).send("There isn't comment. Write the first comment!");
            }
            
            return res.status(200).send(comments);
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    postComment = async (req: Request,res: Response,next: NextFunction) =>{
        let id;
        id = Number(req.params.id) ;

        try{
            const commentContent = req.body.commentContent;
            if(!commentContent || commentContent.length>1000){
                const err = new Error("invalid body data");
                // err.status = 400;
                return next(err);
            }
            const newComment = await prisma.productComment.create({
                data: {
                    commentContent,
                    product:{connect: {id}}
                }
            });
            res.status(201).send(newComment);
        }catch(error){
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err); 
        }
        

    }

    patchComment = async (req: Request,res: Response,next: NextFunction) =>{
        const id = Number(req.params.id) ;
        const commentId = Number(req.params.commentId)
        try{
            const commentContent = req.body.commentContent;

            const newComment = await prisma.productComment.update({
                where:{id:commentId},
                data: {commentContent}
            });
            return res.status(200).send(newComment);

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err); 
        } 
    }

    deleteComment = async (req: Request,res: Response,next: NextFunction) =>{

        const id = Number(req.params.id) ;
        const commentId = Number(req.params.commentId)
        try{
            await prisma.productComment.delete({
                where:{id:commentId}
            });
            return res.status(204).send("delete success");

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err); 
        }
    }
}

export default new ProductController();