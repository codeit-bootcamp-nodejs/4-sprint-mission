


import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ProductValid } from './MiddleWares.js';
import productController from '../controller/product-controller.js';
import productMiddleware from '../Middleware/product-middleware.js';

const prisma = new PrismaClient();

const ProductRouter = express.Router()


//Product API 라우팅
ProductRouter.get('/', 
    productController.getProducts)
    
ProductRouter.get('/detail/:id', 
    productMiddleware.validateId,
    productController.getOneProduct)

ProductRouter.post('/postProduct', 
    ProductValid, 
    productMiddleware.validateId, 
    productMiddleware.validateForm,
    productController.postProduct )

ProductRouter.patch('/detail/:id', 
    productMiddleware.validateId,

    productController.patchProduct )

ProductRouter.delete('/detail/:id', 
    productMiddleware.validateId ,
    productController.deleteProduct)

//Product Comment API 라우팅
ProductRouter.get('/comments', 
    productController.getComments)

ProductRouter.post('/detail/:id/comment', 
    productMiddleware.validateId,
    productController.postComment )

ProductRouter.patch('/detail/:id/comment/:commentId', 
    productMiddleware.validateId, 
    productMiddleware.validateCommentId,
    productController.patchComment )

ProductRouter.delete('/detail/:id/comment/:commentId', 
    productMiddleware.validateId,
    productMiddleware.validateCommentId,
    productController.deleteComment)


export default new ProductRouter;