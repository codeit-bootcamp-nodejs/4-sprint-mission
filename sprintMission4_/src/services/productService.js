import prisma from '../lib/prisma.js'

async function register(authorId, data){
  try{
    const { name, description, price, tags } = data;
    const tagsData = (Array.isArray(tags) && tags.length > 0 ) ? tags : null;
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags: tagsData,
        authorId,
      }
    })
    return newProduct;
  } catch(error){
    throw error;
  }
}

async function update(productId, data){
  try{
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { data }
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
