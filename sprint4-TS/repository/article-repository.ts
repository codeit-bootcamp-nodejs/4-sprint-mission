
import prisma from '../lib/prisma'
import type {User} from '../controller/user-controller.js'
import type { Article } from '../controller/article-controller.js'

export interface postInput{
    title: string,
    articleContent: string,
    user: User,
}

export interface patchInput{
    id: number,
    title: string,
    articleContent: string,
}

export interface postCommentInput{
    commentContent: string, 
    id: number, 
    user: User
}

export interface patchCommentInput{
    commentContent: string, 
    CommentId: number
}


class ArticleRepository{
    getArticleById= async(id: number) => {

        let article :Article = await prisma.article.findUnique({
                        where: {id},
                        include : {comment: true}
        });
        return article
    }

    postArticle = async({title, articleContent, user}:postInput) => {

        let Article: Article =  await prisma.article.create({
                        data: {title,articleContent, userId:user.id}
        });
        return Article
    }

    patchArticle = async({id, title, articleContent}:patchInput) => {
        const Article: Article = await prisma.article.update({
                        where:{id},
                        data: {title,articleContent}
                    })
        return Article 
    }

    deleteArticle = async(id:number) => {
        await prisma.article.delete({
                        where:{id}
        });
    }

    postArticleComment = async({commentContent, id, user}:postCommentInput) => {
        const newComment = await prisma.articleComment.create({
                    data: {
                        commentContent,
                        article: {connect: {id: id}},
                        user:{connect:{id:user.id}}
                    }
        })
        return newComment
    }

    patchArticleComment = async({commentContent, CommentId}:patchCommentInput) => {
        const newComment = await prisma.articleComment.update({
                        where:{id:CommentId},
                        data: {commentContent}
            });
        return newComment
    }

    deleteArticleComment = async(CommentId:number) => {
        await prisma.articleComment.delete({
                        where:{id: CommentId}
        })
    }
}

export default new ArticleRepository();