import prisma from '../lib/prisma.js'

async function register(authorId, data){
  try{
    const {title, content} = data;
    const newArticle = await prisma.article.create({
      data: { 
        authorId,
        title,
        content
      },
    });
    return newArticle;
  } catch(error){
    throw error;
  }
}

async function update(articleId, data){
  try{
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { ...data }
    });
    return updatedArticle;
  } catch(error){
    throw error;
  }
}

async function remove(articleId){
  try{
    await prisma.article.delete({ where: { id : articleId }});
    return true
  } catch(error){
    throw error;
  }
}

async function like(userId, articleId){
  try{
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId : {
           userId,
           articleId, 
          }
      },
    });

    let isLiked 

    if(existedLike){
      await prisma.articleLike.delete({ where: { id: existingLike.id}});
      isLiked = false;
    } else{
      await prisma.articleLike.create({ data: { userId, articleId }});
      isLiked = true;
    }
    return { message: isLiked ? 'Like added successfully' : 'Like removed successfully' }
  } catch(error){
    next(error);
  }
}

async function articleList (userId){
  try{
    const articles = await prisma.article.findMany();

    const articleWithLike = await Promise.all(
      articles.map(async (article) => {
         const isLiked = await prisma.articleLike.findUnique({
          where: {
            userId_articleId: {
              userId,
              articleId: article.id,
            }
          }
         });
         return { ...article, isLiked: !!isLiked };
      })
    );
    return articleWithLike
  } catch(error){
    throw error;
  }
}



export default {
  register,
  update,
  remove,
  like,
  articleList
}