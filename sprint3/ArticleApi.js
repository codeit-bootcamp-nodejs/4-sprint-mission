
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ArticleRouter = express.Router();



//모든 게시글 불러오기, 댓글 미포함
ArticleRouter.get('/', async (req,res) =>{
    let {sort='recent', skip='0', take='30', searchtitle, searchcontent} = req.query;
    console.log(sort, skip, take, searchtitle, searchcontent);
    let orderBy ;
    skip = parseInt(skip);
    take = parseInt(take);
    try{
        if (sort == 'oldest'){        
            orderBy = {createdAt : 'desc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'asc'};
        }else{
            orderBy = {createdAt : 'desc'};
        }

    }catch(error){
        console.error(error)
        return res.status(400).send("400 bad request")
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
        return res.status(500).send("server error")
    }
    
});
     

//게시글 상세 페이지
ArticleRouter.get('/detail/:id', async (req,res) =>{

    try{
        let id = req.params.id;
        id = parseInt(id);
        const Article = await prisma.Article.findUnique({
            where: {id},
            include : {comment: true}
        });
        console.log("get Article success");
        return res.status(200).send(Article);
        
    } catch(error){
        console.error(error);
        return res.status(500).send("server error")
    }
    
});


//   '/article/postarticle' 이란 사이트에서 article 생성하기
ArticleRouter.post('/postArticle', ArticleValid, async (req,res) =>{
    const {title, articleContent} = req.body;
    console.log("post start");
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
        return res.status(500).send("server error")
    }
    
});

//   'article/:id/modfiy'라는 사이트에서 article 수정하기
ArticleRouter.patch('/:id/modify', async (req,res) =>{
    try{
        const {title,articleContent} = req.body; 
        const id = Number(req.params.id);
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
        return res.status(500).send("server error")
    }
    
} );

// article 삭제하기 
ArticleRouter.delete('/detail/:id', async(req,res) =>{
    try{
        const id = Number(req.params.id);
        if (!id){
            return res.send("error occured")
        }
        await prisma.Article.delete({
            where:{id}
        });
        console.log("deleting article success");
        return res.status(200).send("deleting completed");

    } catch(error){
        console.log("delete Article failed because of server");
        return res.send(error)
    }
    
});

// 모든 댓글 불러오기
ArticleRouter.get('/comments', async(req,res) =>{
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

        return res.status(300).send(articleComment)
        ;
        } catch(error){
            console.error(error)
            return res.status(500).send('there was error during finding comments in server')
        }
});

// 게시글 상세 페이지에서 댓글 달기
ArticleRouter.post('/detail/:id', async (req,res) =>{
    let id;
    try{
            id = Number(req.params.id) ;
            const article = prisma.article.findUnique({
                where: {id}
            });
            if (!article){
                throw new Error(error);
            }       
    
        } catch(error){
            return res.status(400).send(error);
        }

    const commentContent = req.body.commentContent;
    if (!commentContent|| commentContent.length>500){
        return res.send("content error!")
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
        return res.send(error);
    }
        
});

//게시글 상세 페이지에서 댓글 수정하기
ArticleRouter.patch('/detail/:id', async (req,res) =>{
    try{
        const id = Number(req.params.id) ;
        const article = prisma.article.findUnique({
            where: {id}
        });
        if (!article){
            throw Error;
        }
    }catch(error){
        console.error(error);
        return res.send(error);
    }
    
    try{
        const CommentId = Number(req.body.id);
        const commentContent = req.body.commentContent;
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
        return res.status(500).send("there was error updating comment in server");
        
    }
});

//게시글 상세페이지에서 댓글 삭제하기 

ArticleRouter.delete('/detail/:id/comment/:commentId', async (req,res) =>{

    const id = Number(req.params.id) ;
    const CommentId= Number(req.params.commentId);
    const article = prisma.article.findUnique({
        where: {id}
    });

    if (!article){
        res.send(error)
    }
    
    try{
        console.log("there is article")
        await prisma.ArticleComment.delete({
            where:{
                id:CommentId
            }
            })
        return res.status(200).send("deleting success");

    }catch(error){
        console.error(error);
        return res.status(500).send("there was error updating comment in server");
        
    }
});


export default ArticleRouter;