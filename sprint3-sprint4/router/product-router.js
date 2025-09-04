import express from 'express'

import likeController from '../controller/like-controller.js';

import productController from '../controller/product-controller.js';
import productMiddleware from '../middleware/product-middleware.js';

import checkAuthenticated from '../middleware/auth-middleware.js';
import checkProductAuthorize from '../middleware/auth-middleware.js';

const prisma = new PrismaClient();

const ProductRouter = express.Router()


//Product API 라우팅
ProductRouter.get('/', 
    productController.getProducts)
    
ProductRouter.get('/detail/:id', 
    productMiddleware.validateId,
    productController.getOneProduct)

ProductRouter.post('/', 
    // ProductValid, 
    productMiddleware.validateId, 
    productMiddleware.validateForm,
    checkAuthenticated,
    productController.postProduct )

ProductRouter.patch('/detail/:id',
    productMiddleware.validateId,
    checkProductAuthorize,
    productController.patchProduct )

ProductRouter.delete('/detail/:id',
    productMiddleware.validateId ,
    checkProductAuthorize,
    productController.deleteProduct)



//like feature
ProductRouter.post('detail/:id',
    productMiddleware.validateId,
    checkAuthenticated,
    likeController.ProductLike
)

ProductRouter.delete('detail/:id',
    productMiddleware.validateId,
    checkAuthenticated,
    likeController.ProductDislike
)



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