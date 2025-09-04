import express from 'express'
import articleController from '../controller/article-controller.js';
import articleMiddleware from '../Middleware/article-middleware.js';
import checkArticleAuthorize from '../Middleware/auth-middleware.js';

const prisma = new PrismaClient();

const ArticleRouter = express.Router();

//article API routing
ArticleRouter.get('/', articleController.getArticles)

ArticleRouter.get('/detail/:id', 
    articleMiddleware.ValidateId,
    articleController.getOneArticle)

ArticleRouter.post('/', 
    articleMiddleware.ArticleValid, 
    articleMiddleware.ValidateForm,
     articleController.postArticle)

ArticleRouter.patch('detail/:id', 
    articleMiddleware.ValidateId, 
    articleMiddleware.ValidateForm,
    checkArticleAuthorize,
    articleController.patchArticle)

ArticleRouter.delete('/detail/:id', 
    articleMiddleware.ValidateId,
    checkArticleAuthorize,
    articleController.deleteArticle )

//article comments API routing
ArticleRouter.get('/comments', 
    articleController.getComments)

ArticleRouter.post('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    articleController.postComment)

ArticleRouter.patch('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    articleController.patchComment)
    
ArticleRouter.delete('/detail/:id/comments/:commentId', 
    articleMiddleware.ValidateId,
    articleController.deleteComment)

export default new ArticleRouter;

