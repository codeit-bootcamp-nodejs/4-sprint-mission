import prisma from '../lib/prisma.js'

async function register(authorId, tags, data){
  try{
    const tagsData = (Array.isArray(tags) && tags.length > 0 ) ? tags: null;
    const newProdcut = await prisma.product.create({
      data: {
        authorId,
        tags: tagsData,
        ...data,
      }
    })
  } catch(error){
    throw error;
  }
}

async function update(productId, data){
  try{
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data
    });
    return updatedProduct;
  } catch(error){
    throw error;
  }
}

async function remove(productId){
  try{
    await prisma.product.delete({ where: { id: productId }});
  } catch (error){
    throw error;
  }
}
  

export default {
  register,
  update,
  remove,
}

// 생성할때 널러블 할 경우... 어떻게 생성을 어떻게 해야할지.. 조건문으로 해결해야하는건지.. 확인필요 