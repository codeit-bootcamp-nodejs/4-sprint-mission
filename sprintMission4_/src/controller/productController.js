import express from 'express';
import productService from '../services/productService.js';
import passport from '../lib/passport/passport.js';
import { checkProductOwner } from '../middlewares/auth.js';

const productRouter = express.Router();

//app.js ) app.use('/product', productRouter);

const createProduct = async(req, res, next) => {
  const { tags, ...data } = req.body;
  const authorId = req.user.id;
  try{
    const newProdcut = await productService.register(authorId,tags, data);
    res.status(201).json(newProdcut);
  }catch(error){
    next();
  }
}
  
const patchProduct = async (req, res,next) => {
  const { data } = req.body;
  const productId = +req.params.productId;
  try{
    const updatedProduct = await productService.update(productId, data);
    res.status(200).json(updatedProduct);
  } catch(error){
     next(error);
  }
}
  

const deleteProduct = async (req, res, next) => {
  const productId  = +req.params.productId;
  try{
    await productService.remove(productId);
    res.status(204).send();
  } catch(error){
    next(error);
  }
};
  

productRouter.route('/')
  .post(passport.authenticate('access-token', { session: false}),createProduct);

productRouter.route('/:productId')
  .patch(passport.authenticate('access-token', { session: false }),checkProductOwner,patchProduct)
  .delete(passport.authenticate('access-token', { session: false }),checkProductOwner,deleteProduct);

export default productRouter