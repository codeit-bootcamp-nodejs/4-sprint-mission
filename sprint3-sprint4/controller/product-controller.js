
import productService from '../service/product-service.js';
import prisma from '../lib/prisma.js'


export class ProductController{
    getProducts = async (req,res,next) =>{
        let {sort = 'recent', skip = 10, take= 10, searchName, searchDescription} = req.query;
        
        const data = {sort, skip, take, searchName, searchDescription};
        try{
            let products = productService.getProducts(data);
            
            for (let product of products){
                product = productService.addIsLiked(product);
            }

            return res.status(200).send(products);
            
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
            
        }
    }

    getOneProduct = async (req,res,next) =>{
        const id = Number(req.params.id);
    
        try{
            let product = await prisma.product.findUnique({
                where:{id},
                include: {comment:true}
            });
            product = productService.addIsLiked(product);
            return res.status(200).send(product);
            
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    postProduct = async (req,res,next) =>{
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
            err.status = 500;
            return next(err);
        }
    }


    patchProduct = async (req,res,next) =>{
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
            err.status = 500;
            return next(err);
        }
    }

    deleteProduct = async (req,res,next) =>{
        const id = Number(req.params.id) ;
        try{
            await prisma.Product.delete({
                where:{id}
            });
            console.log("deleting success");
            return res.status(204).send("deleting successed");
            
        }catch(error){
            console.log('deleting product failed because of server error');
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    getComments = async (req,res,next) =>{
        try{
            let {take = '10',skip= '1',commentId = '1'} = req.query;
            take = parseInt(take);
            skip = parseInt(skip);
            commentId = parseInt(commentId);

            const comments= await prisma.ProductComment.findMany({
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
            err.status = 500;
            return next(err);
        }
    }

    postComment = async (req,res,next) =>{
        let id;
        id = Number(req.params.id) ;

        try{
            const commentContent = req.body.commentContent;
            if(!commentContent || commentContent.length>1000){
                const err = new Error("invalid body data");
                err.status = 400;
                return next(err);
            }
            const newComment = await prisma.ProductComment.create({
                data: {
                    commentContent,
                    product:{connect: {id}}
                }
            });
            res.status(201).send(newComment);
        }catch(error){
            const err = new Error("Server Error");
            err.status = 500;
            return next(err); 
        }
        

    }

    patchComment = async (req,res,next) =>{
        const id = Number(req.params.id) ;

        try{
            const commentContent = req.body.commentContent;

            const newComment = await prisma.ProductComment.update({
                where:{id:CommentId},
                data: {commentContent}
            });
            return res.status(200).send(newComment);

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err); 
        } 
    }

    deleteComment = async (req,res,next) =>{

        const id = Number(req.params.id) ;

        try{
            await prisma.ProductComment.delete({
                where:{id:CommentId}
            });
            return res.status(204).send("delete success");

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err); 
        }
    }
}

export default new ProductController();