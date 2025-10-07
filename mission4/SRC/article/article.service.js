import prisma from "../../lib/prisma.js"

export class ArticleService {
    async getArticlesList({ takeNumber, skip, title, content, keyword }){
        const where = {};
        if (title) where.title = { contains: title, mode: "insensitive"};
        if (content) where.content = { contains: content ,  mode: "insensitive"};
        console.log("where조건 :", where)
        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: "insensitive" } },
                { content: { contains: keyword, mode: "insensitive" } }
            ];
        }

        console.log("Prisma where 조건:", where);
        const articlesList = await prisma.article.findMany({
            where,
            orderBy : {createdAt:"desc"},
            take: takeNumber,
            skip:skip
        })
        return articlesList
    }

    async getArticle({articleId}){
        const article = await prisma.article.findUnique({
            where: {id :articleId}
        })
        if(!article) throw{ status : 404, message:"해당 게시글이 존재 하지않습니다"}
        return article
    }
    
    async createArticle({title, content, name}){
       return await prisma.article.create({
            data:{
                title,
                content,
                owner:{
                        connectOrCreate:{
                            where: { nickname: name }, // User.nickname은 @unique여야 함
                            create: {
                                nickname: name,
                                email: `${name}@example.com`,
                            }
                        }
                    } 
                    
            }
        })
    }
    
    async patchArticle({articleId, title, content}){
        await this.getArticle({articleId})
        return await prisma.article.update({
            where: {id : articleId},
            data:{
                title,
                content,
            }
        })
    }
    
    async deleteArticle({articleId}){
        await this.getArticle({articleId})
        return await prisma.article.delete({where:{id:articleId}})
    }
    
}