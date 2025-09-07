import express from 'express';
import passport from '../lib/passport/passport.js';
import productService from '../services/productService.js';
import auth from '../middlewares/auth.js';

const productRouter = express.Router();

productRouter.post(
  '/auth/products',
  passport.authenticate('access-token', { session: false }),
  async(req, res) => {
    try{
      const userId = req.user.id;
      const { name, description, price } = req.body;
      const newProduct = await productService.registerProduct(userId, {
        name,
        description,
        price: +price,
      });
      res.status(201).json(newProduct);
    } catch(error){
      console.error('Error Registsering product:', error);
      res.status(error.code || 500).json({ message: error.message});
    }
  }
);

productRouter.patch(
  '/auth/products/:productId',
  passport.authenticate('access-token', { session: false }),
  auth.checkProductOwner,
  async (req, res) => {
    try{
      const productId = +req.params.productId;
      const data  = req.body; 
      const updatedProduct = await productService.updateProduct(productId, data);
      res.status(201).json(updatedProduct);
    } catch(error){
      console.error('Error Updating product:', error);
      res.status(error.code || 500).json({ message: error.message });
    }
  }
);