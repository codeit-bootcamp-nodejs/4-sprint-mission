import express from 'express'
import prisma from '../lib/prisma'
import ArticleService from '../service/article-service';
import type { Request, Response, NextFunction } from 'express';

//모든 게시글 불러오기, 댓글 미포함
interface User{
    id: number,
    password: string,
    image: string,
    email: string,

}

interface Article{
    id: number,
    title: string,
    articleContent: string,
    createdAt: Date,
    updatedAt: Date,
    userId: number
}

interface Product{
    id: number
}

interface getArticleParams{
    sort: string,
    skip: number,
    take: number,
    searchtitle: string,
    searchcontent: string
}

export class ArticleController{

    getArticles = async (req: Request<{},{},{}, getArticleParams>, res: Response, next: NextFunction) =>{
        let {sort ='recent', skip = 0, take=30, searchtitle, searchcontent} = req.query;
    
        skip = Number(skip);
        take = Number(take);
        const data: getArticleParams = {sort, skip, take, searchtitle,searchcontent}
        
        const user = req.user;
        console.log(user)

        try{
            let articles = await ArticleService.getArticles(data)
            for (let article of articles){
                ArticleService.addIsLiked(user, article)
            }
            res.status(200).send(articles);
        } catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    getOneArticle = async (req: Request<{id:number},{},{}, {}>, res: Response, next: NextFunction) =>{
        try{
            let id = req.params.id;
            id = Number(id);
            const user = req.user;
            console.log(user)
            let article = await prisma.article.findUnique({
                where: {id},
                include : {comment: true}
            });

            article = await ArticleService.addIsLiked(user, article);

            return res.status(200).send(article);
            
        } catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    postArticle = async (req: Request,res: Response,next: NextFunction) =>{
        const {title, articleContent} = req.body;

        try{
            let Article =  await prisma.article.create({
                data: {title,articleContent}
            });
            console.log("post Article success");
            return res.status(201).send(Article);
        }catch(error){
            console.log("post Article failed because of server");
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    
    }

    patchArticle = async (req: Request,res: Response,next:NextFunction) =>{
        try{
            const id = Number(req.params.id);
            const {title, articleContent} = req.body;

            const Article: Article = await prisma.article.update({
                where:{id},
                data: {title,articleContent}
            })
            console.log("patch Article success")
            return res.status(200).send(Article);

        } catch(error){
            console.log("patch Article failed because of server");
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    deleteArticle = async(req: Request,res: Response,next:NextFunction) =>{
        try{
            const id = Number(req.params.id);

            await prisma.article.delete({
                where:{id}
            });

            console.log("deleting article success");
            return res.status(204).send("deleting completed");
        } catch(error){
            console.log("delete Article failed because of server");
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    getComments = async(req: Request,res: Response,next:NextFunction) =>{
        try{
            let {take = '10',skip= '1',commentId = '1'} = req.query;
            
            const data = {take, skip, commentId}
            const articleComment =await ArticleService.getComment(data);

            return res.status(200).send(articleComment);

        }catch(error){
            console.error(error)
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);
        }
    }

    postComment = async (req: Request,res: Response,next:NextFunction) =>{

        const id = Number(req.params.id) ;

        const commentContent = req.body.commentContent;
        if (!commentContent|| commentContent.length>500){
            next(new Error("invalid body"))
        }

        try{
            const newComment = await prisma.articleComment.create({
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
            // err.status = 500;
            return next(err);
        }
        
    }

    patchComment = async (req: Request,res: Response,next:NextFunction) =>{

        const id = Number(req.params.id) ;
        try{
            const CommentId = Number(req.body.id);
            const commentContent = req.body.commentContent;

            if(!commentContent){
                const err = new Error("invalid body data");
                // err.status = 400;
                return next(err)
            }

            const newComment = await prisma.articleComment.update({
                where:{id:CommentId},
                data: {commentContent}
            });
            
            return res.status(200).send(newComment);
        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);;
            
        }
    }

    deleteComment = async (req: Request,res: Response,next:NextFunction) =>{
        try{
            const CommentId= req.params.commentId
            await prisma.articleComment.delete({
                where:{id: CommentId}
            })
            return res.status(204).send("deleting success");

        }catch(error){
            console.error(error);
            const err = new Error("Server Error");
            // err.status = 500;
            return next(err);;
            
        }
    }
    
}

export default new ArticleController();