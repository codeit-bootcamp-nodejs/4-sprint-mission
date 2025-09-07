import prisma from '../lib/prisma';

async function registerArticle(userId, data){
  const newArticle = await prisma.article.create({
    data: {
      authorId : userId,
      ...data,
    }
  });
  return newArticle; 
  };

  async function updateArticle(articleId, data){
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data,
    });
    return updatedArticle;
  }

export default {
  registerArticle,
  updateArticle,
  

}