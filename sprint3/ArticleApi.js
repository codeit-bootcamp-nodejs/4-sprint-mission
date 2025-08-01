
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//need troubleshooting at networking, validating, console.log, 
ArticleRouter.get('/', async (req,res) =>{
    const {sort, offset, title, content} = req.query;
    const Articles = await prisma.Article.findMany({

    })
});


ArticleRouter.get('/:id', async (req,res) =>{
    const id = req.params.id;
    const Article = await prisma.Article.findUnique({
        data: {id}
    });
    res.send(Article);
});



ArticleRouter.post('/', (req,res) =>{
    const {title, content} = req.body;
    const Article =  prisma.Article.create({
        data: {
            title,
            content
        }
    });
    res.send(Article);
});


ArticleRouter.patch('/:id', (req,res) =>{
    const {title,content} = req.body; 
    const id = req.params.id;
    const Article = prisma.Article.update({
        data: {
            title,
            content
        }
    })
} );


ArticleRouter.delete('/:id', (req,res) =>{
    const id = req.params.id;
    prisma.Article.delete({
        where:{id}
    });
    console.log("data deleting success")
} );

export default ArticleRouter;