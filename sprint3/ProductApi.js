import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ProductValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const app = express()
const ProductRouter = express.Router()

//게시글 전체 불러오기
ProductRouter.get('/', async (req,res) =>{
    let {sort = 'recent', skip = '20', take= '10', searchName, searchDescription} = req.query;
    skip = parseInt(skip);
    take = parseInt(take);

    try{
        
        let orderBy ;

        if (sort === 'oldest'){        
            orderBy = {createdAt : 'desc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'asc'};
        }else{
            throw new Error;
        }

        if (typeof(skip) != 'number' ||typeof(take) != 'number'){
            throw new Error;
        }

    }catch(error){
        console.error(error);
        return res.status(400).send("400 bad request");
    }

    try{
        const {name, description} = req.query;
        const Product = await prisma.product.findMany({
            // skip,
            take,
            where: {
                AND:[
                    searchName? {name: {contains : searchName}} : undefined,
                    searchDescription? {content: {contains : searchDescription}} : undefined
                ].filter(Boolean)
                
            }
        });
        console.log(`get product : ${Product.length}`);
        return res.status(200).send(Product);
        
    }catch(error){
        console.error(error);
        return res.status(500).send("interner Server Error");
        
    }
});

//게시글 상세페이지
ProductRouter.get('/detail/:id', async (req,res) =>{
    let id = req.params.id;
    id = parseInt(id);
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
        return res.status(500).end("interner Server Error");
    }
    
});

//게시글 posting
ProductRouter.post('/postProduct', ProductValid, async (req,res) =>{
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
        return res.status(500).send("interner Server Error");
    }
});

//게시글 수정하기
ProductRouter.patch('/:id/modify', async (req,res) =>{
    const {name, description, price, tags} = req.body;
    const id = req.params.id ;

    try{
        const product= prisma.product.update({
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
        return res.status(500).send("server error");
    }
});

//게시글 삭제하기 
ProductRouter.delete('/:id', async (req,res) =>{
    const id = req.params.id ;

    try{
        prisma.product.delete({
            where:{id}
        });
        console.log("deleting success");
        return res.status(200).send("deleting successed");
        
    }catch(error){
        console.log('deleting product failed because of server error');
        return res.status(500).send("server error");
    }
});





//------------------------------댓글-----------------



//모든 댓글 보기
ProductRouter.get('/comments', async (req,res) =>{
    try{
        const comments= await prisma.productComment.findMany();
        if (!comments){
            return res.status(300).send("There isn't comment. Write the first comment!");
        }

        return res.status(300).send(comments);
    }catch(error){
        console.error(error);
        return res.status(500).send("there was error during finding comments");
    }
});    

    




//게시글 상세페이지에서 댓글 달기
ProductRouter.post('/:id', async (req,res) =>{
    try{
        const id = req.params.id ;
        const product = prisma.product.findUnique({
            where: {id}
        });

        if (!product){
            throw Error;
        }
    }catch(error){
        return res.status(404).send("no product");
    }
    

    const commentContent = req.body.commentContent;

    const newComment = prisma.ProductComment.create({
        data: {
            commentContent
        }
    });

});


//게시글 상세페이지에서 댓글 수정하기
ProductRouter.patch('/:id', async (req,res) =>{
    try{
        const id = req.params.id ;
        const product = prisma.product.findUnique({
            where: {id}
        });

        if (!product){
            throw Error;
        }
    }catch(error){
        return res.status(404).send("no product");
    }
    
    try{
        const CommentId = req.body.Id;
        const commentContent = req.body.commentContent;

        const newComment = prisma.ProductComment.update({
            where:{
                id:CommentId
            },
            data: {
                commentContent
            }
        });
        return res.status(201).send(newcomment);

    }catch(error){
        return res.status(500).send("server error occured during updating comment");
        console.log("server error occured during updating comment");
    }
   
    
});

//댓글 삭제하기



export default ProductRouter;