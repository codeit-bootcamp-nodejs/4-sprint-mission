
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';
const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//need validating, console.log, 
ArticleRouter.get('/', async (req,res) =>{
    try{
        let {sort = 'recent', skip = 40, take= 10, searchTitle, searchContent} = req.query;
        let orderBy ;

        if (sort == 'oldest'){        
            orderBy = {createdAt : 'asc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'desc'};
        }else{
            throw Error;
        }

        skip = parseInt(skip);
        take = parseInt(take);
        // if (typeof(skip) != 'number' ||typeof(take) != 'number'){
        //     throw Error;
        // }

    }catch(error){
        console.log("get article failed because of input type ")
        res.status(400).send("400 bad request")
    }
    
    try{
        const Articles = await prisma.Article.findMany({
            // include: {
            //     comment:true
            // },
            skip,
            take,
            where: {
                AND:[
                    searchTitle? {title:{contains : searchTitle}} : {},
                    searchContnet? {content:{contains : searchContent}} : {}
                ]   
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
        id = parseInt(id);
        const Article = await prisma.Article.findUnique({
            where: {id},
            include : {comment: true}
        });
        console.log("get Article success");
        res.status(200).send(Article);
        
    } catch(error){
        console.log("get Article/id failed because of server error");
        res.status(500).send("server error")
    }
    
});



ArticleRouter.post('/', ArticleValid, (req,res) =>{
    const {title, content} = req.body;
    
    try{
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


ArticleRouter.patch('/:id/modify', (req,res) =>{
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