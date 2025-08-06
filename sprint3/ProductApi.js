
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ProductValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ProductRouter = express.Router()



//게시글 전체 불러오기
ProductRouter.get('/', async (req,res) =>{
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
        next(new Error("Server Error"));
        
    }
});

//게시글 상세페이지
ProductRouter.get('/detail/:id', async (req,res) =>{
    let id = req.params.id;
    id = parseInt(id);

    if (!id){
        next(new Error("invalid parameter"));
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
        next(new Error("Server Error"));
    }
    
});

//게시글 posting
ProductRouter.post('/postProduct', ProductValid, async (req,res) =>{
    const {name,description, price, tags} = req.body;
    if (!name|| !description ||!price || !tags){
        next(new Error("invalid body data"))
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
        next(new Error("Server Error"));
    }
});

//게시글 수정하기
ProductRouter.patch('/detail/:id/modify', async (req,res) =>{
    const {name, description, price, tags} = req.body;
    const id = Number(req.params.id) ;

    if (!id){
        next(new Error("invalid parameter"));
    }

    if (!name|| !description ||!price || !tags){
        next(new Error("invalid body data"));
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
        next(new Error("Server Error"));
    }
});

//게시글 삭제하기 
ProductRouter.delete('/detail/:id', async (req,res) =>{
    const id = Number(req.params.id) ;
    if (!id){
            next(new Error("invalid parameter"))
    }

    try{
        await prisma.Product.delete({
            where:{id}
        });
        console.log("deleting success");
        return res.status(200).send("deleting successed");
        
    }catch(error){
        console.log('deleting product failed because of server error');
        next(new Error("Server Error"));
    }
});





//------------------------------댓글-----------------



//모든 댓글 보기
ProductRouter.get('/comments', async (req,res) =>{
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
        next(new Error("Server Error"));
    }
});    

    




//게시글 상세페이지에서 댓글 달기
ProductRouter.post('/detail/:id', async (req,res) =>{
    let id;
    id = Number(req.params.id) ;

    if (!id){
        next(new Error("invalid parameter"))
    }


    const product = await prisma.Product.findUnique({
        where: {id}
    });

    if (!product){
        next(new Error("no content"));
    }


    
    try{
        const commentContent = req.body.commentContent;
        if(!commentContent || commentContent.length>1000){
            next(new Error("invalid body data"));
        }
        const newComment = await prisma.ProductComment.create({
            data: {
                commentContent,
                product:{connect: {id}}
            }
        });
        res.send(newComment);
    }catch(error){
        next(new Error("Server Error")); 
    }
    

});


//게시글 상세페이지에서 댓글 수정하기
ProductRouter.patch('/detail/:id', async (req,res) =>{
    const id = Number(req.params.id) ;
    const CommentId = Number(req.body.id);

    if (!id){
        next(new Error("invalid parameter"))
    }
    if (!CommentId){
        next(new Error("invalid body data"))
    }

    const product = await prisma.product.findUnique({
        where: {id}
    });

    if (!product){
        next(new Error("no content"));
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
        next(new Error("Server Error")); 
    }
   
    
});

//댓글 삭제하기
ProductRouter.delete('/detail/:id/comment/:commentId', async (req,res) =>{

    const id = Number(req.params.id) ;

    if (!id){
        next(new Error("invalid parameter"))
    }

    const product = await prisma.product.findUnique({
        where: {id}
    });

    if (!product){
        next(new Error("no content"));
    }
    const CommentId = Number(req.params.commentId);
    if (!CommentId){
        next(new Error("invalid parameter"));
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
        next(new Error("Server Error")); 
    }
})


export default ProductRouter;