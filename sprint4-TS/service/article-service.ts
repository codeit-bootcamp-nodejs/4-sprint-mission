import prisma from '../lib/prisma.js'

interface getArticleParams{
    sort: string,
    skip: number,
    take: number,
    searchtitle: string,
    searchcontent: string
}

interface getCommentParams{
    take:number,
    skip:number,
    commentId:number
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

    addIsLiked = async(user, article) => {
        
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