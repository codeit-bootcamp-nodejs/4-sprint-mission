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

export default {
  register,
  update,
  remove,
}