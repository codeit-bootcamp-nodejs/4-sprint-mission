
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';


const prisma = new PrismaClient();

const ArticleRouter = express.Router();


//모든 게시글 불러오기, 댓글 미포함
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
     

//게시글 상세 페이지
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
        res.status(201).send(Article);
        console.log("post Article success");

    } catch(error){
        console.log("get Article failed because of server");
        res.status(500).send("server error")
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
        res.status(201).send(Article);

    } catch(error){
        console.log("patch Article failed because of server");
        res.status(500).send("server error")
    }
    
} );

// article 삭제하기 
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

// 모든 댓글 불러오기
ArticleRouter.get('/comments', (req,res) =>{
    try{
            const article = prisma.Articlecomment.findMany();
        } catch(error){
            res.status(500).send('there was error during finding comments in server')
        }
});

// 게시글 상세 페이지에서 댓글 달기
ArticleRouter.post('/:id', ArticleValid, (req,res) =>{
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
            const content = req.body.commentcontent;
            if (content =='undefined'|| content.length>500){
                throw Error;
            }
        } catch (error){
            res.status(400).send('message content is too long or undefined')
        }
        try{
            const newComment = prisma.Articlecomment.create({
            data: {
                commentcontent
            }
        });
        } catch(error){
            console.log("comment POST Error Occured");
            res.status(500).send("there was error during making comment");
        }
        
});

//게시글 상세 페이지에서 댓글 수정하기
ArticleRouter.patch('/:id', (req,res) =>{
    try{
        const id = req.params.id ;
        const article = prisma.article.findUnique({
            where: {id}
        });
        if (!article){
            throw Error;
        }
    }catch(error){
        res.status(404).send("no article");
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
        res.status(201).send(newComment);
    }catch(error){
        res.status(500).send("there was error updating comment in server");
        console.log("there was error updating comment in server");
    }
});

//게시글 상세페이지에서 댓글 삭제하기 










export default ArticleRouter;