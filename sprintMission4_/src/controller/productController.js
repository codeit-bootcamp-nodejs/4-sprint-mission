import express from 'express';
import commentService from '../services/commentService.js';
import productService from '../services/productService.js';
import passport from '../lib/passport/passport.js';
import { 
  checkProductOwner,
  checkProductCommentOwner } from '../middlewares/auth.js';

const productRouter = express.Router();

//app.js ) app.use('/product', productRouter);

const createProduct = async(req, res, next) => { 
  try{
    const authorId = req.user.id;
    const data = req.body;
    const newProdcut = await productService.register(authorId, data);
    res.status(201).json(newProdcut);
  }catch(error){
    next(error);
  }
}
  
const patchProduct = async (req, res,next) => {
  try{
    const productId = +req.params.productId;
    const data = req.body;
    const updatedProduct = await productService.update(productId, data);
    res.status(200).json(updatedProduct);
  } catch(error){
     next(error);
  }
}
  

const deleteProduct = async (req, res, next) => {
  try{
    const productId  = +req.params.productId;
    await productService.remove(productId);
    res.status(204).send();
  } catch(error){
    next(error);
  }
};

const createProductComment = async(req, res, next) => {
  try{
    const authorId = req.user.id
    const productId = +req.params.productId;
    const content = req.body.content;
    const newProductComment = await commentService.registerProductComment(productId, authorId,content);
    res.status(201).json(newProductComment);
  } catch(error){
    next(error);
  }
}

const patchComment = async (req, res, next) => {
  try{
    const content = req.body.content;
    const commentId = +req.params.commentId;
    const updatedComment = await commentService.updateComment(commentId, content);
    res.status(201).json(updatedComment);
  } catch(error){
    next(error);
  }
}

const deleteComment = async (req, res, next) => {
  try{
    const commentId = +req.params.commentId;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch(error){
    next(error);
  }
};


const controlLike = async(req, res, next) => {
  try {
    const userId = req.user.id;
    const productId  = +req.body.productId;
    const likeStatus = await articleService.like(userId, productId);
    res.status(200).json(likeStatus);
  } catch(error){
    next(error);
  }
}


productRouter.route('/')
  .post(passport.authenticate('access-token', { session: false}),createProduct);

productRouter.route('/:productId')
  .patch(passport.authenticate('access-token', { session: false }),checkProductOwner,patchProduct)
  .delete(passport.authenticate('access-token', { session: false }),checkProductOwner,deleteProduct);

productRouter.route('/:productId/comments')
  .post(passport.authenticate('access-token', { session: false }), createProductComment)

productRouter.route('/:productId/comments/:commentId')
  .patch(passport.authenticate('access-token', { session: false }), checkProductCommentOwner, patchComment)
  .delete(passport.authenticate('access-token', { session: false }), checkProductCommentOwner, deleteComment)

productRouter.post('/:productId/likes',passport.authenticate('access-token', { session: false}), controlLike)
export default productRouter