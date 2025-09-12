import prisma from '../lib/prisma.js'


export class ArticleService{
    getArticles = async({skip, take, sort, searchtitle, searchcontent}) =>{
    
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

    getComment = async({take,skip,commentId}) => {
        take = parseInt(take);
        skip = parseInt(skip);
        commentId = parseInt(commentId);

        
        const articleComment =await prisma.ArticleComment.findMany({
            take,
            skip,
            cursor: {id: commentId},
            orderBy:{id: 'asc'}
        });
        return articleComment;
    }

    addIsLiked = async(user,article) => {
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