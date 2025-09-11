import prisma from '../lib/prisma.js'

async function register(authorId, data){
  try{
    const newProduct = await prisma.product.create({
      data: { 
        authorId,
        ...data,
      },
    });
    return newArticle;
  } catch(error){
    throw error;
  }
}

async function update(articleId, data){
  try{
    const updatedProduct = await prisma.product.update({
      where: { id: articleId },
      data
    });
    return updatedArticle;
  } catch(error){
    throw error;
  }
}

async function remove(articleId){
  try{
    await prisma.product.delete({ where: { articleId }});
    return deleteArticle
  } catch(error){
    throw error;
  }
}

export default {
  register,
  update,
  remove,
}