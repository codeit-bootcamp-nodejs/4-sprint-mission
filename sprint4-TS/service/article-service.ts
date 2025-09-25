import prisma from '../lib/prisma.js'
import ArticleRepository from '../repository/article-repository.js'
import type { postInput, patchInput, postCommentInput, patchCommentInput } from '../repository/article-repository.js'
import type { User } from '../controller/user-controller.js'
import articleRepository from '../repository/article-repository.js'

interface getArticleParams{
    sort: string,
    skip: number,
    take: number,
    searchtitle: string,
    searchcontent: string
}

interface getOneArticleData{
    id: number,
    user: User
}

interface patchServiceData extends patchInput{
    user: User
}

interface getCommentParams{
    take:number,
    skip:number,
    commentId:number
}

interface addIsLiked{
    user:User,
    article:any
}


export class ArticleService{
    getArticles = async({skip, take, sort, searchtitle, searchcontent}:getArticleParams) =>{
    
        let orderBy ;
        skip = Number(skip);
        take = Number(take);

        if (sort == 'oldest'){        
            orderBy = {createdAt : 'desc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'asc'};
        }else{
            orderBy = {createdAt : 'desc'};
        }

        const Articles = await prisma.article.findMany({
            skip,
            take,
            orderBy,
            where: {
                AND:[{title:
                        {contains : searchtitle ,
                        mode : 'insensitive'}},
                    {articleContent:{contains : searchcontent}}]}
        })
         return Articles
    }

    getOneArticle = async({id, user}:getOneArticleData) =>{
        let article = await ArticleRepository.getArticleById(id);
        article = await this.addIsLiked({user, article});
        return article
    }

    postArticle = async({title, articleContent, user}:postInput) => {
        const inputData = {title, articleContent, user}
        let article = await ArticleRepository.postArticle(inputData)
        article = await this.addIsLiked({user,article})
        return article
    }

    patchArticle = async({id, title, articleContent, user}:patchServiceData) => {
        const inputData = {id, title, articleContent}
        let article = await ArticleRepository.patchArticle(inputData)
        article = await this.addIsLiked({user,article})
        return article
    }

    deleteArticle = async(id: number) => {
        await ArticleRepository.deleteArticle(id)
    }






    getComment = async({take,skip,commentId}:getCommentParams) => {
        take = Number(take);
        skip = Number(skip);
        commentId = Number(commentId);

        
        const articleComment =await prisma.articleComment.findMany({
            take,
            skip,
            cursor: {id: commentId},
            orderBy:{id: 'asc'}
        });
        return articleComment;
    }

    postComment = async({commentContent,id,user}:postCommentInput) => {
        const newComment =await articleRepository.postArticleComment({commentContent,id,user})
        return newComment
    }

    patchComment = async({commentContent,CommentId}:patchCommentInput ) => {
        const newComment = await articleRepository.patchArticleComment({commentContent,CommentId})
        return newComment
    }

    deleteComment = async(id:number) => {
        await articleRepository.deleteArticleComment(id)
    }




    addIsLiked = async({user, article}:addIsLiked) => {
        
        const articleLikeList = user.articleLike;
        const likedArticleIds = [];
        if (!articleLikeList){
            article.isLiked = false;
        }else{
            for (const articleLike of articleLikeList){
                let articleId = articleLike.articleId;
                likedArticles.push(article)
            }

            const articleId = Number(article.id)
            if (likedArticleIds.includes(articleId)){
                article.isLiked = true;
            }else {
                article.isLiked = false;
            }
        }
        return article
    }
}

export default new ArticleService();