import { Prisma } from '@prisma/client';
import express from 'express';
import prisma from '@prisma/client'



const ArticleCommentRouter = express.Router()

ArticleCommentRouter.get('', (req,res) => {
    try{
        const article = prisma.Articlecomment.findMany();
    } catch(error){
        res.status(500).send('there was error during finding comments in server')
    }
    

});


ArticleCommentRouter.post('/', (req,res) => {
    try{
        const id = req.params.id ;
        const article = prisma.article.findUnique({
            where: {id}
        });
        if (!article){
            throw Error;
        }       

    } catch(error){
        res.status(400).send("invalid Article ID");
    }
    try{
        const content = req.body.content;
        if (content =='undefined'|| content.length>500){
            throw Error;
        }
    } catch (error){
        res.status(400).send('message content is too long or undefined')
    }
    try{
        const newComment = prisma.Articlecomment.create({
        data: {
            content
        }
    });
    } catch(error){
        console.log("comment POST Error Occured");
        res.status(500).send("there was error during making comment");
    }
    
});

ArticleCommentRouter.patch('/:id', (req,res) => {
    const id = req.params.id ;
    const article = prisma.article.findUnique({
        where: {id}
    });
    if (!article){
        res.status(404).send("no article");
    }

    //comment 형식이 어떻게 req로부터 올지?
    const CommentId = req.body.commentId;
    //const content = req.body.

    const newComment = prisma.Articlecomment.update({
        where:{
            id:CommentId
        },
        data: {
            //content
        }
    })
    res.send(comment);
});

ArticleCommentRouter.delete('/:id', (req,res) => {
    const id = req.params.id ;

    const article = prisma.article.findUnique({
        where: {id}
    });
    if (!article){
        res.status(404).send("no article");
    }

    const newComment = prisma.Articlecomment.delete({
        where:{
            id:CommentId
        }
    });

    res.status(200).send("deleting comment completed");
    console.log("deleting comment completed");
});



