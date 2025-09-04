import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ArticleValid } from './MiddleWares.js';
import ArticleService from '../service/article-service.js';

const prisma = new PrismaClient();

const ArticleRouter = express.Router();



//모든 게시글 불러오기, 댓글 미포함


export class ArticleController{

    getArticles = async (req,res,next) =>{
        let {sort='recent', skip='0', take='30', searchtitle, searchcontent} = req.query;
        
        skip = parseInt(skip);
        take = parseInt(take);
        const data = {sort, skip, take, searchtitle,searchcontent, skip, take}
        
        try{
            const Articles = ArticleService.getArticles(data)
            res.status(200).send(Articles);
        } catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    getOneArticle = async (req,res,next) =>{
        try{
            let id = req.params.id;
            id = parseInt(id);
            
            const Article = await prisma.Article.findUnique({
                where: {id},
                include : {comment: true}
            });

            return res.status(200).send(Article);
            
        } catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    postArticle = async (req,res,next) =>{
        const {title, articleContent} = req.body;

        try{
            const Article =  await prisma.Article.create({
                data: {title,articleContent}
            });
            console.log("post Article success");
            return res.status(201).send(Article);
        }catch(error){
            console.log("post Article failed because of server");
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    
    }

    patchArticle = async (req,res,next) =>{
        try{
            const id = Number(req.params.id);
            const {title, articleContent} = req.body;

            const Article = await prisma.Article.update({
                where:{id},
                data: {title,articleContent}
            })
            console.log("patch Article success")
            return res.status(200).send(Article);

        } catch(error){
            console.log("patch Article failed because of server");
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    deleteArticle = async(req,res,next) =>{
        try{
            const id = Number(req.params.id);

            await prisma.Article.delete({
                where:{id}
            });

            console.log("deleting article success");
            return res.status(204).send("deleting completed");
        } catch(error){
            console.log("delete Article failed because of server");
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    getComments = async(req,res,next) =>{
        try{
            let {take = '10',skip= '1',commentId = '1'} = req.query;
            take = parseInt(take);
            skip = parseInt(skip);
            commentId = parseInt(commentId);

            
            const articleComment =await prisma.ArticleComment.findMany({
                take,
                skip,
                cursor: {id: commentId},
                orderBy:{id: 'asc'}
            });

            return res.status(200).send(articleComment);

        }catch(error){
            console.error(error)
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
    }

    postComment = async (req,res,next) =>{

        const id = Number(req.params.id) ;

        const article = prisma.article.findUnique({
            where: {id}
        });

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
            return res.status(201).send(newComment);
        } catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);
        }
        
    }

    patchComment = async (req,res,next) =>{

        const id = Number(req.params.id) ;
        const article = prisma.article.findUnique({
            where: {id}
        });


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
                where:{id:CommentId},
                data: {commentContent}
            });
            
            return res.status(200).send(newComment);
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);;
            
        }
    }

    deleteComment = async (req,res,next) =>{

        const id = Number(req.params.id) ;
        const CommentId= Number(req.params.commentId);

        if(!CommentId || !id){
            const err = new Error("invalid parameter")
            err.status = 400;
            return next(err);
        }
        
        try{
            await prisma.ArticleComment.delete({
                where:{id:CommentId}
            })
            return res.status(204).send("deleting success");

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            err.status = 500;
            return next(err);;
            
        }
    }
    
}

export default new ArticleController();