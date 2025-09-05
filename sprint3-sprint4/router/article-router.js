import express from 'express'

import LikeController from '../controller/like-controller.js';

import articleController from '../controller/article-controller.js';
import articleMiddleware from '../middleware/article-middleware.js';

import checkAuthenticated from '../middleware/auth-middleware.js';
import checkArticleAuthorize from '../middleware/auth-middleware.js';
import passport from 'passport';
import ValidCommentForm from '../middleware/comment-middleware.js';

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
    passport.authenticate('AccessToken', {session:false}) ,
    checkAuthenticated,
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


//like feature
ArticleRouter.post('detail/:id',
    passport.authenticate('AccessToken', {session:false}) ,
    likeController.ArticleLike
)

ArticleRouter.delete('detail/:id',
    passport.authenticate('AccessToken', {session:false}) ,
    likeController.ArticleDislike
)


//article comments API routing
ArticleRouter.get('/comments', 
    articleController.getComments)

ArticleRouter.post('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    passport.authenticate('AccessToken', {session:false}) ,
    articleController.postComment)

ArticleRouter.patch('/detail/:id/comments', 
    articleMiddleware.ValidateId,
    articleController.patchComment)
    
ArticleRouter.delete('/detail/:id/comments/:commentId', 
    articleMiddleware.ValidateId,
    articleController.deleteComment)

export default new ArticleRouter;

