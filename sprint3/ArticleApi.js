
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//모든 게시글 불러오기, 댓글 미포함
ArticleRouter.get('/', async (req,res) =>{
    let {sort='recent', skip='40', take='10', searchTitle, searchContent} = req.query;

    let orderBy ;
    skip = parseInt(skip);
    take = parseInt(take);
    try{

        if (sort == 'oldest'){        
            orderBy = {createdAt : 'asc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'desc'};
        }else{
            throw new Error;
        }

        console.log(sort, skip, take, searchTitle, searchContent);

    }catch(error){
        console.log("get article failed because of input type ")
        return res.status(400).send("400 bad request")
    }

    
    try{
        const Articles = await prisma.Article.findMany({
            skip,
            take,
            where: {
                AND:[
                    searchTitle? {title:{contains : searchTitle}} : undefined,
                    searchContent? {content:{contains : searchContent}} : undefined
                ].filter(Boolean)
            }
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


//   '/post/postarticle' 이란 사이트에서 article 생성하기
ArticleRouter.post('/postArticle', ArticleValid, (req,res) =>{
    const {title, content} = req.body;
    
    try{
        const Article =  prisma.Article.create({
            data: {
                title,
                content
            }
        });
        return res.status(201).send(Article);
        console.log("post Article success");

    } catch(error){
        console.log("get Article failed because of server");
        return res.status(500).send("server error")
    }
    
});

//   'article/:id/modfiy'라는 사이트에서 article 수정하기
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
        return res.status(201).send(Article);

    } catch(error){
        console.log("patch Article failed because of server");
        return res.status(500).send("server error")
    }
    
} );

// article 삭제하기 
ArticleRouter.delete('/detail/:id', (req,res) =>{
    try{
        const id = req.params.id;
        prisma.Article.delete({
            where:{id}
        });
        console.log("deleting article success");
        return res.send(200).send("deleting completed");

    } catch(error){
        console.log("patch Article failed because of server");
        return res.status(500).send("server error")
    }
    
});

// 모든 댓글 불러오기
ArticleRouter.get('/comments', async(req,res) =>{
    try{
        const article =await prisma.ArticleComment.findMany(
            
        )
        res.send(article)
        ;
        } catch(error){
            console.error(error)
            return res.status(500).send('there was error during finding comments in server')
        }
});

// 게시글 상세 페이지에서 댓글 달기
ArticleRouter.post('/detail/:id', ArticleValid, (req,res) =>{
    try{
            const id = req.params.id ;
            const article = prisma.article.findUnique({
                where: {id}
            });
            if (!article){
                throw Error;
            }       
    
        } catch(error){
            return res.status(400).send("invalid Article ID");
        }

    try{
        const content = req.body.commentcontent;
        if (content =='undefined'|| content.length>500){
            throw Error;
        }
    } catch (error){
        return res.status(400).send('message content is too long or undefined')
    }

    try{
        const newComment = prisma.Articlecomment.create({
        data: {
            commentcontent
        }
    });
    } catch(error){
        console.log("comment POST Error Occured");
        return res.status(500).send("there was error during making comment");
    }
        
});

//게시글 상세 페이지에서 댓글 수정하기
ArticleRouter.patch('/detail/:id', (req,res) =>{
    try{
        const id = req.params.id ;
        const article = prisma.article.findUnique({
            where: {id}
        });
        if (!article){
            throw Error;
        }
    }catch(error){
        return res.status(404).send("no article");
    }
    
    try{
        const CommentId = req.body.Id;
        const commentContent = req.body.commentContent;
        const newComment = prisma.Articlecomment.update({
            where:{
                id:CommentId
            },
            data: {
                commentContent
            }     
    });
        return res.status(201).send(newComment);
    }catch(error){
        return res.status(500).send("there was error updating comment in server");
        console.log("there was error updating comment in server");
    }
});

//게시글 상세페이지에서 댓글 삭제하기 

ArticleRouter.patch('/detail/:id', (req,res) =>{
    try{
        const id = req.params.id ;
        const article = prisma.article.findUnique({
            where: {id}
        });
        if (!article){
            throw Error;
        }
    }catch(error){
        return res.status(404).send("no article");
    }
    
    try{
        const CommentId = req.body.Id;
        prisma.Articlecomment.delete({
            where:{
                id:CommentId
            }
            })
        return res.status(200).send("deleting success");

    }catch(error){
        return res.status(500).send("there was error updating comment in server");
        console.log("there was error updating comment in server");
    }
});








export default ArticleRouter;