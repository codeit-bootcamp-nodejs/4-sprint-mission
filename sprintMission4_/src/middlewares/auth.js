import prisma from '../lib/prisma.js'

export async function checkProductOwner(req, res, next){
  try{
    const productId = +req.params.productId;
    const product = await prisma.product.findUnique({ where: { id: productId }});

    if(!product){
      const error = new Error('Product not found');
      error.status = 404; 
      throw error;
    }
    if(product.authorId !== req.user.id ){
      const error = new Error('Forbidden'); 
      error.status = 403; 
      throw error;
    }
    return next();
    } catch (error){
      return next(error);
    }
  }

export async function checkArticleOwner(req, res, next){
  try{
    const articleId = +req.params.articleId;
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if(!article){
      const error = new Error('Article not found');
      error.status = 404;
      throw error;
    }
    if( article.authorId !== req.user.id ){
      const error = new Error('Forbidden'); 
      error.status = 403;
      throw error;
    }
    return next();
    } catch (error){
      return next(error);
    }
  }

export async function checkProductCommentOwner(req, res, next){
  try{
    const productId = +req.params.productId;
    const commentId = +req.params.commentId;

    const comment = await prisma.comment.findUnique({ 
      where: { id: commentId },
    });

    if(!comment){
      const error = new Error('Comment not found');
      error.status = 404;
      throw error;
    }
    
    if( comment.productId !== productId || comment.authorId !== req.user.id ){
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    return next();
   } catch (error){
     return next(error);
   }
 }

export async function checkArticleCommentOwner(req, res, next){
  try{
    const articleId = +req.params.articleId;
    const commentId = +req.params.commentId;

    const comment = await prisma.comment.findUnique({ 
      where: { id: commentId }
    });
    
    if(!comment){
      const error = new Error('Comment not found');
      error.status = 404;
      throw error;
    }
    
    if(comment.articleId !== articleId || comment.authorId !== req.user.id){
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    return next();
    } catch (error){
      return next(error);
    }
  }