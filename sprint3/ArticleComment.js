import { Prisma } from '@prisma/client';
import express from 'express';
import prisma from '@prisma/client'



const ArticleCommentRouter = express.Router()

ArticleCommentRouter.get('', (req,res) => {

});


ArticleCommentRouter.post('/', (req,res) => {
    const id = req.params.id ;
    const article = prisma.article.findUnique({
        where: {id}
    });
    if (!article){
        res.status(404).send("no article");
    }

    //comment 형식이 어떻게 req로부터 올지?
    //const content = req.body.

    const newComment = prisma.Articlecomment.create({
        data: {
            //content
        }
    });
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



