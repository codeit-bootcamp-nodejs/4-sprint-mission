
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//need validating, console.log, 
ArticleRouter.get('/', async (req,res) =>{
    try{
        const {sort = 'recent', skip = 40, take= 10, searchTitle, searchContent} = req.query;
        let orderBy ;
        if (sort === oldest){        
            orderBy = {createdAt : 'desc'};
        }else {
            orderBy = {createdAt : 'asc'};
        }


        const Articles = await prisma.Article.findMany({
            include: {
                Comment
            },
            skip,
            take,
            where: {
                title:{contains : searchTitle},
                content:{contains : searchContent}
            }
         })
        
    } catch(error){
        console.log("get Article failed");
        res.status(500).send("server error")
    }
    
});
     


ArticleRouter.get('/:id', async (req,res) =>{

    try{
        const id = req.params.id;
        const Article = await prisma.Article.findUnique({
            data: {id}
        });
        console.log("get Article success");
        res.status(200).send(Article);
        
    } catch(error){
        console.log("get Article failed because of server error");
        res.status(500).send("server error")
    }
    
});



ArticleRouter.post('/', (req,res) =>{

    try{
        const {title, content} = req.body;
        const Article =  prisma.Article.create({
            data: {
                title,
                content
            }
        });
        res.status(201).send(Article);
        console.log("post Article success");
    } catch(error){
        console.log("get Article failed because of server");
        res.status(500).send("server error")
    }
    
    
});


ArticleRouter.patch('/:id', (req,res) =>{
    try{
        const {title,content} = req.body; 
        const id = req.params.id;
        const Article = prisma.Article.update({
            data: {
                title,
                content
            }
        })
        console.log("patch Article success")
        res.status(201).send(Article);

    } catch(error){
        console.log("patch Article failed because of server");
        res.status(500).send("server error")
    }
    
} );


ArticleRouter.delete('/:id', (req,res) =>{
    try{
        const id = req.params.id;
        prisma.Article.delete({
            where:{id}
        });
        console.log("deleting article success");
        res.send(200).send("deleting completed");

    } catch(error){
        console.log("patch Article failed because of server");
        res.status(500).send("server error")
    }
    
});

export default ArticleRouter;