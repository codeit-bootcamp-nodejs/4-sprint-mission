
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ArticleRouter = express.Router();



//모든 게시글 불러오기, 댓글 미포함
ArticleRouter.get('/', async (req,res,next) =>{
    let {sort='recent', skip='0', take='30', searchtitle, searchcontent} = req.query;
    let orderBy ;
    skip = parseInt(skip);
    take = parseInt(take);

    if (sort == 'oldest'){        
        orderBy = {createdAt : 'desc'};
    }else if (sort == 'recent'){
        orderBy = {createdAt : 'asc'};
    }else{
        orderBy = {createdAt : 'desc'};
    }

    try{
        const Articles = await prisma.Article.findMany({
            skip,
            take,
            where: {
                AND:[
                    {
                        title:{
                            contains : searchtitle ,
                            mode : 'insensitive'
                        }
                    },
                    {
                        articleContent:{
                            contains : searchcontent
                        }
                    } 
                ]
            },
            orderBy:orderBy
         })

        res.send(Articles);
    } catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
});
     

//게시글 상세 페이지
ArticleRouter.get('/detail/:id', async (req,res,next) =>{

    try{
        let id = req.params.id;
        id = parseInt(id);
        if (!id){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }
        const Article = await prisma.Article.findUnique({
            where: {id},
            include : {comment: true}
        });
        if (!Article){
            const err = new Error("No content")
            err.status = 404
            return next(err);
        }
        console.log("get Article success");
        return res.status(200).send(Article);
        
    } catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
});


//   '/article/postarticle' 이란 사이트에서 article 생성하기
ArticleRouter.post('/postArticle', ArticleValid, async (req,res,next) =>{
    const {title, articleContent} = req.body;
    // console.log("post start");

    if (!title || !articleContent){
        const err = new Error("invalid body data");
        err.status = 400;
        return next(err)
    }

    try{
        const Article =  await prisma.Article.create({
            data: {
                title,
                articleContent
            }
        });
        console.log("post Article success");
        return res.status(201).send(Article);
        

    } catch(error){
        console.log("post Article failed because of server");
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
});

//   'article/:id/modfiy'라는 사이트에서 article 수정하기
ArticleRouter.patch('/:id/modify', async (req,res,next) =>{
    try{
        const {title,articleContent} = req.body; 
        const id = Number(req.params.id);

        if (!id){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }

        if (!title || !articleContent){
            const err = new Error("invalid body data");
            err.status = 400;
            return next(err)
        }

        const Article = await prisma.Article.update({
            where:{
                id
            },
            data: {
                title,
                articleContent
            }
        })
        console.log("patch Article success")
        return res.status(201).send(Article);

    } catch(error){
        console.log("patch Article failed because of server");
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
} );

// article 삭제하기 
ArticleRouter.delete('/detail/:id', async(req,res,next) =>{
    try{
        const id = Number(req.params.id);

        if (!id){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }

        const article = await prisma.Article.findUnique({
            where:{id}
        })

        if (!article){
            const err = new Error("No content")
            err.status = 404
            return next(err);
        }

        await prisma.Article.delete({
            where:{id}
        });
        console.log("deleting article success");
        return res.status(200).send("deleting completed");

    } catch(error){
        console.log("delete Article failed because of server");
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
    
});

// 모든 댓글 불러오기
ArticleRouter.get('/comments', async(req,res,next) =>{
    try{
        let {take = '10',skip= '1',commentId = '1'} = req.query;
        take = parseInt(take);
        skip = parseInt(skip);
        commentId = parseInt(commentId);

        
        const articleComment =await prisma.ArticleComment.findMany({
            take,
            skip,
            cursor: {
                id: commentId
            },
            orderBy:{
                id: 'asc'
            }
        });

        return res.status(300).send(articleComment);

        } catch(error){
            console.error(error)
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
});

// 게시글 상세 페이지에서 댓글 달기
ArticleRouter.post('/detail/:id', async (req,res,next) =>{

    const id = Number(req.params.id) ;
    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    const article = prisma.article.findUnique({
        where: {id}
    });
    if (!article){
        const err = new Error("No content")
        err.status = 404
        return next(err);
    }

    const commentContent = req.body.commentContent;
    if (!commentContent|| commentContent.length>500){
        next(new Error("invalid body"))
    }

    try{
        const newComment = await prisma.ArticleComment.create({
        data: {
            commentContent,
            article: {
                connect: {id: id}
            }
        }
        });
        return res.send(newComment)
    } catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);
    }
        
});

//게시글 상세 페이지에서 댓글 수정하기
ArticleRouter.patch('/detail/:id', async (req,res,next) =>{

    const id = Number(req.params.id) ;
    const article = prisma.article.findUnique({
        where: {id}
    });

    if (!id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }
    if (!article){
        const err = new Error("No content")
        err.status = 404
        return next(err);
    }

    try{
        const CommentId = Number(req.body.id);
        const commentContent = req.body.commentContent;
        if(!CommentId){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }
        if(!commentContent){
            const err = new Error("invalid body data");
            err.status = 400;
            return next(err)
        }

        const newComment = await prisma.ArticleComment.update({
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
        return next(err);;
        
    }
});

//게시글 상세페이지에서 댓글 삭제하기 

ArticleRouter.delete('/detail/:id/comment/:commentId', async (req,res,next) =>{

    const id = Number(req.params.id) ;
    const CommentId= Number(req.params.commentId);

    if(!CommentId || !id){
        const err = new Error("invalid parameter")
        err.status = 400;
        return next(err);
    }

    const article = await prisma.article.findUnique({
        where: {id}
    });

    if (!article){
        const err = new Error("No content")
        err.status = 404
        return next(err);
    }
    
    try{
        await prisma.ArticleComment.delete({
            where:{
                id:CommentId
            }
            })
        return res.status(200).send("deleting success");

    }catch(error){
        console.error(error);
        const err = new Error("Server Error");
        err.status = 500;
        return next(err);;
        
    }
});


export default ArticleRouter;