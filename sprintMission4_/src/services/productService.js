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

async function like(userId, productId){
  try{
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId : {
           userId,
           productId, 
          }
      },
    });

    let isLiked 

    if(existedLike){
      await prisma.productLike.delete({ where: { id: existingLike.id}});
      isLiked = false;
    } else{
      await prisma.productLike.create({ data: { userId, productId }});
      isLiked = true;
    }
    return { message: isLiked ? 'Like added successfully' : 'Like removed successfully' }
  } catch(error){
    next(error);
  }
}
  
export default {
  register,
  update,
  remove,
  like,
  
}
