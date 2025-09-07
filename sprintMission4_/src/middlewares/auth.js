import prisma from '../lib/prisma.js'

export async function checkProductOwner(req, res, next){
  try{
    const productId = req.params.id;
    const product = await prisma.findUnique({
      where: { id: productId },
    });

    if(!product){
      const error = new Error('Product not found');
      throw error;
    }
    if( product.authorId !== req.user.id ){
      const error = new Error('Forbbiden');
      throw error;
    }
      return next();
    } catch (error){
      return next(error);
    }
  }

export async function checkArticleOwner(req, res, next){
  try{
    const articletId = req.params.id;
    const article = await prisma.findUnique({
      where: { id: articletId },
    });

    if(!article){
      const error = new Error('Article not found');
      throw error;
    }
    if( article.authorId !== req.user.id ){
      const error = new Error('Forbbiden');
      throw error;
    }
      return next();
    } catch (error){
      return next(error);
    }
  }

