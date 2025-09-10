import prisma from '../lib/prisma.js'

async function registerProduct(userId, data){
  const newProduct = await prisma.product.create({
    data: { 
      userId,
      ...data,
    },
  });
  return newProduct;
}

async function updateProduct(productId, data){
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data
  });
  return updatedProduct;
}

async function deleteProduct(productId){
  const deleteProduct = await prisma.product.delete({
    where: { productId }
  });
  return deleteProduct
}
  

export default {
  registerProduct,
  updateProduct,
  deleteProduct
}