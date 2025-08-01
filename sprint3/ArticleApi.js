
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//need validating, console.log, 
ArticleRouter.get('/', async (req,res) =>{
    try{
        const {sort, offset, title, content} = req.query;
        const Articles = await prisma.Article.findMany({

         })
    } catch(error){
        res.status(500).send("server error")
    }
    
});
     


ArticleRouter.get('/:id', async (req,res) =>{

    try{
        const id = req.params.id;
        const Article = await prisma.Article.findUnique({
            data: {id}
        });
        res.status(200).send(Article);
        
    } catch(error){
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
        
    } catch(error){
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
        res.status(201).send(Article);

    } catch(error){
        res.status(500).send("server error")
    }
    
} );


ArticleRouter.delete('/:id', (req,res) =>{
    try{
        const id = req.params.id;
        prisma.Article.delete({
            where:{id}
        });
        console.log("data deleting success");
        res.send(200).send("deleting completed");

    } catch(error){
        res.status(500).send("server error")
    }
    
});

export default ArticleRouter;