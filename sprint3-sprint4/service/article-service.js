import { skip } from "@prisma/client/runtime/library"



export class ArticleService{
    getArticles = async(skip,take,sort,searchtitle, searchcontent) =>{
    
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

        const Articles = await prisma.Article.findMany({
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


}

export default new ArticleService();