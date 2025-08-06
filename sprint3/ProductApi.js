
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ProductValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ProductRouter = express.Router()



//게시글 전체 불러오기
ProductRouter.get('/', async (req,res,next) =>{
    let {sort = 'recent', skip = '10', take= '10', searchName, searchDescription} = req.query;
    skip = parseInt(skip);
    take = parseInt(take);
    let orderBy ;

    if (sort === 'oldest'){        
        orderBy = {createdAt : 'desc'};
    }else if (sort == 'recent'){
        orderBy = {createdAt : 'asc'};
    }else{
        orderBy = {createdAt : 'desc'};
    }

    try{
        const Product = await prisma.product.findMany({
            skip,
            take,
            where: {
                AND:[
                    searchName? {name: {contains : searchName}} : undefined,
                    searchDescription? {content: {contains : searchDescription}} : undefined
                ].filter(Boolean)
            },
            orderBy
        });
        return res.status(200).send(Product);
        
    }catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
        
    }
});

//게시글 상세페이지
ProductRouter.get('/detail/:id', async (req,res,next) =>{
    let id = req.params.id;
    id = parseInt(id);

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    try{
        const Product = await prisma.product.findUnique({
            where:{id},
            include: {
                comment:true
            }
        });

        console.log(`get product : ${Product}`);
        return res.status(200).send(Product);
        
    }catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
});

//게시글 posting
ProductRouter.post('/postProduct', ProductValid, async (req,res,next) =>{
    const {name,description, price, tags} = req.body;
    if (!name|| !description ||!price || !tags){
        const err = new Error("invalid body data");
        err.status = 400;
        return next(err)
    }

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
});

//게시글 수정하기
ProductRouter.patch('/detail/:id/modify', async (req,res,next) =>{
    const {name, description, price, tags} = req.body;
    const id = Number(req.params.id) ;

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    if (!name|| !description ||!price || !tags){
        const err = new Error("invalid body data");
        err.status = 400;
        return next(err);
    }

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
        return res.status(201).send(product);
        
    }catch(error){
        console.log('patch product failed because of server error');
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
});

//게시글 삭제하기 
ProductRouter.delete('/detail/:id', async (req,res,next) =>{
    const id = Number(req.params.id) ;
    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    try{
        await prisma.Product.delete({
            where:{id}
        });
        console.log("deleting success");
        return res.status(200).send("deleting successed");
        
    }catch(error){
        console.log('deleting product failed because of server error');
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
});





//------------------------------댓글-----------------



//모든 댓글 보기
ProductRouter.get('/comments', async (req,res,next) =>{
    try{
        let {take = '10',skip= '1',commentId = '1'} = req.query;
        take = parseInt(take);
        skip = parseInt(skip);
        commentId = parseInt(commentId);

        const comments= await prisma.ProductComment.findMany({
            take,
            skip,
            cursor: {
                id: commentId
            },
            orderBy:{
                id: 'asc'
            }
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
});    

    




//게시글 상세페이지에서 댓글 달기
ProductRouter.post('/detail/:id', async (req,res,next) =>{
    let id;
    id = Number(req.params.id) ;

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }


    const product = await prisma.Product.findUnique({
        where: {id}
    });

    if (!product){
        const err = new Error("No content")
        err.status = 404;
        return next(err);
    }


    
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
        res.send(newComment);
    }catch(error){
        const err = new Error("Server Error");
        err.status = 500;
        return next(err); 
    }
    

});


//게시글 상세페이지에서 댓글 수정하기
ProductRouter.patch('/detail/:id', async (req,res,next) =>{
    const id = Number(req.params.id) ;
    const CommentId = Number(req.body.id);

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }
    if (!CommentId){
        const err = new Error("invalid body data");
        err.status = 400;
        return next(err)
    }

    const product = await prisma.product.findUnique({
        where: {id}
    });

    if (!product){
        const err = new Error("No content")
        err.status = 404;
        return next(err);
    }


    
    try{
        const commentContent = req.body.commentContent;

        const newComment = await prisma.ProductComment.update({
            where:{
                id:CommentId
            },
            data: {
                commentContent
            }
        });
        return res.status(201).send(newComment);

    }catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err); 
    }
   
    
});

//댓글 삭제하기
ProductRouter.delete('/detail/:id/comment/:commentId', async (req,res,next) =>{

    const id = Number(req.params.id) ;

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    const product = await prisma.product.findUnique({
        where: {id}
    });

    if (!product){
        const err = new Error("No content")
        err.status = 404;
        return next(err);
    }
    const CommentId = Number(req.params.commentId);
    if (!CommentId){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    try{
        await prisma.ProductComment.delete({
            where:{
                id:CommentId
            }
        });
        return res.status(200).send("delete success");

    }catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err); 
    }
})


export default ProductRouter;